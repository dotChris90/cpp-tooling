/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
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
import { Conan } from './conan';
import { TerminalInput } from '../input-output/terminal-input';
import { TerminalOutput } from '../input-output/terminal-output';

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

        this.out = output;
        this.in = input;

        this.toolMng = new ToolManager(this.out,tmpDir);
        this.projectFileParser = new CPSConfigManager(path.join(tmpDir,"cps.yml"));
    }

    public async apiInstallPkgs(
        projectFile = "",
        profile = "",
        buildType = "",
        buildDst = "",
        importPkg = true,
        importDst = "",
        createHeaderFolder = true,
        headerFolder = "",
        includeTestDir = true) : Promise<void> {
            
        this.out.clear();
        
        if (projectFile === "") {
            projectFile = path.join(await this.in.readInput("Choose cps.yml dir", process.cwd()),"cps.yml");
        } 

        const prjFolder = path.dirname(projectFile);

        if (profile === "") {
            const profiles = await this.toolMng.getConan().getProfiles();
            profile = await this.in.pickFromList("Choose Profile",profiles);
        }

        if (buildType === "") {
            buildType = await this.in.pickFromList("Choose build type",["Debug","Release"]);
        } 
       
        if (buildDst === "") {
            buildDst = await this.in.readInput("Choose build dir", path.join(prjFolder,"build"));
        }
        
        fse.mkdirpSync(buildDst);
        fse.rmSync(buildDst, {force:true,recursive:true });
        fse.mkdirpSync(buildDst);

        await this.toolMng.getConan().install(profile,"default",buildType,prjFolder,buildDst);

        if (includeTestDir) {
            const testFolder = path.join(prjFolder,"test_package");
            await this.toolMng.getConan().install(profile,"default",buildType,testFolder,buildDst);
        }
            
        if (importPkg) {
            if (importDst === "") {
                importDst = await this.in.readInput("Choose import pkg destination",path.join(path.dirname(projectFile),".cps","pkg"));
            }
            const pkgsFolder = importDst;
            await this.toolMng.getConan().installAsDeployment(profile,"default",buildType,prjFolder,pkgsFolder);
            if (includeTestDir) {
                const testFolder = path.join(prjFolder,"test_package");
                await this.toolMng.getConan().install(profile,"default",buildType,testFolder,buildDst);
            }
        }

        if (createHeaderFolder) {
            if (headerFolder === "") {
                headerFolder = await this.in.readInput("Choose include folder for packages",path.join(importDst,"include"));
            }
            const packages = fse.readdirSync(importDst, { withFileTypes: true })
                          .filter(dirent => dirent.isDirectory())
                          .filter(dirent => !(dirent.name === "include"))
                          .map(dirent => dirent.name);
        
            fse.mkdirpSync(headerFolder);                
            for (const packageIdx of packages) {
                    const includeIdx = path.join(importDst, packageIdx, "include");
                    if (fse.existsSync(includeIdx)){
                        fse.copySync(includeIdx,headerFolder);
                    }
                }
        }

    }


    public async apiInitProject(
        prjName = "",
        prjVersion = "",
        prjPkgMng = "",
        prjTemplate = "",
        prjBuild = "",
        prjDst = "",
        all = true) : Promise<void> {

        const templateDir = path.join(
                os.homedir(),
                ".conan",
                "templates",
                "command",
                "new"
        );
        
        const templates = fse.readdirSync(templateDir);
        
        const name      = (prjName === "")      ? await this.in.readInput("Project name (package name) : ","abc") : prjName;
        const version   = (prjVersion === "")   ? await this.in.readInput("Version :","0.1.0")                    : prjVersion;
        const location  = (prjDst === "")       ? await this.in.readInput("Location :",process.cwd())             : prjDst;
        const template  = (prjTemplate === "")  ? await this.in.pickFromList("template :",templates)              : prjTemplate;
        
        this.out.clear();

        return this.initProject(name,version,template,location,all).then( ()=> this.out.writeOut("Project generation completed."));
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
        cpsFileLocation : string, 
        installTools = true) : Promise<void> {

        const toolPath = path.join(path.dirname(cpsFileLocation),".tools");
        fse.mkdirpSync(toolPath);

        this.toolMng = new ToolManager(this.out,toolPath);
        this.projectFileParser = new CPSConfigManager(cpsFileLocation);
        this.projectFileParser.generateCPSFile();

        return installTools ? this.toolMng.setup() : Promise.resolve();                ;
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
        location : string,
        installTools = true) : Promise<void> {
        
        fse.mkdirpSync(location);

        this.out.writeOut("|------------------------------------|")
        this.out.writeOut(" Creating project with data :       ")
        this.out.writeOut(` - name : ${name}`)
        this.out.writeOut(` - version : ${version}`)
        this.out.writeOut(` - template : ${template}`)
        this.out.writeOut(` - location : ${location}`)
        this.out.writeOut("|------------------------------------|")
        
        const clangTidyLocation = path.join(location,".clang-tidy");
        const clangFormatLocation = path.join(location,".clang-format");
        const doxygenLocation = path.join(location,"doxy.conf");
        const metrixppLocation = path.join(location,"metrixpp.config");
        const cpsFileLocation = path.join(location,"cps.yml");

        return this.toolMng.getConan().createNewPkg(name,version,template,location)
                .then( () => {
                    this.out.writeOut(`Generat .clang-format at ${clangFormatLocation}`);
                    return this.toolMng.getClang().generateClangFormat(clangFormatLocation);
                    })
                .then( () => {
                    this.out.writeOut(`Generat .clang-tidy at ${clangTidyLocation}`);
                    return this.toolMng.getClang().generateClangTidy(clangTidyLocation);
                })
                .then( () => {
                    this.out.writeOut(`Generat doxy.conf at ${doxygenLocation}`);
                    return this.toolMng.getDoxygen().generateConf(doxygenLocation);
                })
                .then( () => {
                    this.out.writeOut(`Generat metrixpp.config at ${metrixppLocation}`);
                    return this.toolMng.getMetrixpp().generateConfig(metrixppLocation);
                })
                .then( () => {
                    this.out.writeOut(`Generat cps file at ${cpsFileLocation}`);
                    return this.initCppProjectSupport(cpsFileLocation,installTools);
                })
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

    public static createTerminalBased() : CppProjectSupport {
        return (new CppProjectSupport(new TerminalInput(), new TerminalOutput()));
    }

}