/* eslint-disable no-plusplus */
/* eslint-disable unicorn/prefer-string-slice */
/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */

import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';
import * as utils from '@dotchris90/utils-extensions';
import { Executor } from '../executor';
import { ToolManager } from '../tool-manager';
import { ITextOutput } from '../input-output/i-text-output';
import { CPSConfigManager } from './cps-config-manager';
import { ITextInput } from '../input-output/i-text-input';
import { InvalidPathError } from '../Error/wrong-dir-error';

export class CppProjectSupport {

    protected toolMng : ToolManager;

    protected out : ITextOutput;

    protected in : ITextInput;

    protected projectFileParser : CPSConfigManager;

    constructor(
        input : ITextInput,
        output : ITextOutput) {

        const tmpDir = fse.mkdtempSync(path.join(os.tmpdir(), "cps_"));
        fse.mkdirpSync(tmpDir);

        this.toolMng = new ToolManager(this.out,tmpDir);
        this.projectFileParser = new CPSConfigManager(path.join(tmpDir,"cps.yml"));

        this.out = output;
        this.in = input;
    }


    public async apiInitProject() : Promise<void> {
        const name = await this.in.readInput("Project name (package name) :","abc");
        const version = await this.in.readInput("Version :","0.1.0");
        const template = await this.in.readInput("template :","default");
        const location = await this.in.readInput("Location :",process.cwd());

        return this.initProject(name,version,template,location);
    }

    public async apiInitDoygen() : Promise<void> {
        const location = await this.in.readInput("Location :",process.cwd());
        return this.toolMng.getDoxygen().generateConf(path.join(location,"doxy.conf"));
    }

    public async apiInitClang() : Promise<void> {
        const location = await this.in.readInput("Location :",process.cwd());
        return this.toolMng.getClang().generateClangFormat(path.join(location,".clang-format"))
                    .then( ()=> this.toolMng.getClang().generateClangTidy(path.join(location,".clang-tidy")) );
    }

    public async apiInitMetrixpp() : Promise<void> {
        const location = await this.in.readInput("Location :",process.cwd());
        return this.toolMng.getMetrixpp().generateConfig(path.join(location,"metrixpp.config"));
    }

    public async initCppProjectSupport(
        cpsFileLocation : string) : Promise<void> {

        this.toolMng = new ToolManager(this.out,path.join(path.dirname(cpsFileLocation),".tools"));
        this.projectFileParser = new CPSConfigManager(cpsFileLocation);
        this.projectFileParser.generateCPSFile();

        return this.toolMng.setup();                ;
        
    }

    public async generateDefaultTemplate() : Promise<void> {
        return this.toolMng.getConan().generatePkgTemplate();
    }

    /*
    public async generatePackageHeaders() : Promise<void> {
        
    }*/

    public async initProject(
        name : string,
        version : string, 
        template : string, 
        location : string) : Promise<void> {
        
        
        const clangTidyLocation = path.join(location,".clang-tidy");
        const clangFormatLocation = path.join(location,".clang-format");
        const doxygenLocation = path.join(location,"doxy.conf");
        const metrixppLocation = path.join(location,"metrixpp.config");
        const cpsFileLocation = path.join(location,"cps.yml");

        return this.toolMng.getConan().createNewPkg(name,version,template,location)
                .then( () => this.toolMng.getClang().generateClangFormat(clangFormatLocation))
                .then( () => this.toolMng.getClang().generateClangTidy(clangTidyLocation))
                .then( () => this.toolMng.getDoxygen().generateConf(doxygenLocation))
                .then( () => this.toolMng.getMetrixpp().generateConfig(metrixppLocation))
                .then( () => this.initCppProjectSupport(cpsFileLocation));
    }

    public async addSourcesToTarget() : Promise<void> {
        const projectRoot = path.dirname(this.projectFileParser.getCPSFileLocation());
        const sourceFilesAll = utils.Utils.searchPathRecursive(
            ["*.cpp","*c","*.cc"],
            projectRoot
        );
        for(let idx = 0; idx < sourceFilesAll.length;idx++)
            sourceFilesAll[idx] = sourceFilesAll[idx].substring(projectRoot.length);
        const targets = this.projectFileParser.getTargetNames();
        const selectedTargetName = await this.in.pickFromList("Select target",targets);
        const selectedTarget = this.projectFileParser.getTarget(selectedTargetName);
        const sourceFilesAllSet = sourceFilesAll.copyAsSet();
        sourceFilesAllSet.delArray(selectedTarget.src);

        const selectedSrcFiles = await this.in.pickFromListMulti(
            `Select source files to add to target ${selectedTargetName}`,
            sourceFilesAllSet.copyAsArray()
        );

        this.projectFileParser.addSrcs2Target(selectedTargetName,selectedSrcFiles);

        return Promise.resolve();
    }

    public async rmSourcesFromTarget() : Promise<void> {
        
        const targets = this.projectFileParser.getTargetNames();
        const selectedTargetName = await this.in.pickFromList("Select target",targets);
        const selectedTarget = this.projectFileParser.getTarget(selectedTargetName);

        const selectedSrcFiles = await this.in.pickFromListMulti(
            `Select source files to remove from target ${selectedTargetName}`,
            selectedTarget.src
        );

        this.projectFileParser.rmSrcsFromTarget(selectedTargetName,selectedSrcFiles);

        return Promise.resolve();
    }

}