/* eslint-disable promise/always-return */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as process from 'process';
import * as commandExists from 'command-exists';
import * as utilsExt from '@dotchris90/utils-extensions';
import * as os from 'os';
import * as fs from 'fs';

import { Installer } from "./installer";
import { ITextOutput } from "./i-text-output";
import { Conan } from './tools/conan';
import { Doxygen } from './tools/doxygen';
import { Metrixpp } from './tools/metrixpp';
import { Clang } from './tools/clang';
import { Dot } from './tools/dot';
import { CMake } from './tools/cmake';
import { CppCheck } from './tools/cppcheck';

import { InstallationPkg } from "./installation/installation-pkg";
import { Executor } from './executor';

export class ToolManager {

    protected conan : Conan;

    protected doxygen : Doxygen;

    protected metrixpp : Metrixpp;

    protected clang : Clang;

    protected dot : Dot;

    protected cmake : CMake;

    protected cppcheck : CppCheck;
    
    protected inst : Installer;
    
    protected toolInstallPath : string;

    protected out : ITextOutput;

    protected exec : Executor;

    constructor(
        out : ITextOutput, 
        toolInstallPath = path.join(process.cwd(),".tools")
        ) {
            this.out = out;
            this.exec = new Executor(this.out)
            this.inst = new Installer(this.out);
            if (!fs.existsSync(toolInstallPath)) {
                throw new Error("Path does not exist");
            }
            this.toolInstallPath = toolInstallPath;
        }

    public async setup() : Promise<void> {

        await this.inst.setup();
        this.conan = new Conan(this.exec);
        this.clang = new Clang(this.exec,"");
        this.dot = new Dot(this.exec,"");
    } 

    protected checkToolExist(toolcommand : string) : boolean {
        let toolsIsPresent = false;
        let searchPattern = `${path.sep}${toolcommand}`;
        if (os.platform() === "win32") {
            searchPattern = `${searchPattern}.exe`;
        }
        const toolPath = utilsExt.Utils.searchPathRecursive(
            [searchPattern],
            this.toolInstallPath
        );
        if (!commandExists.sync(toolcommand) && toolPath.length === 0) {
            // pass
        }
        else {
            toolsIsPresent = true;
        }
        return toolsIsPresent;
    }

    public async installMetrixpp() : Promise<void> {
        // metrixpp 1.7.1 pip3 
        if (this.checkToolExist("metrix++")) {
            // pass 
            this.out.writeOut("metrix++ already present.");
            this.metrixpp = new Metrixpp(this.exec);
            return Promise.resolve();            
        }
        else {
            const metrixPkg = new InstallationPkg();
            metrixPkg.installStrategy = "pip3";
            metrixPkg.location = "global";
            metrixPkg.name = "metrixpp";
            metrixPkg.version = "1.7.1";
            return (this.inst.installPkg(metrixPkg).then(  async() => {
                this.metrixpp = new Metrixpp(this.exec);
            }));
        }
    }

    public async installCMake() : Promise<void> {
        // cmake','3.23.1
        if (this.checkToolExist("cmake")) {
            // pass 
            this.out.writeOut("cmake already present.");
            this.cmake = new CMake(this.exec,"cmake");
            return Promise.resolve();
        }
        else {
            let cmakePath = path.join(this.toolInstallPath,"cmake","bin","cmake");
            const cmakePkg = new InstallationPkg();
            cmakePkg.installStrategy = "conan";
            cmakePkg.location = this.toolInstallPath;
            cmakePkg.name = "cmake";
            cmakePkg.version = "3.20.5"
            return (this.inst.installPkg(cmakePkg).then( async() => {
                this.cmake = new CMake(this.exec,cmakePath);
            }));
        }

    }

    public async installCppCheck() : Promise<void> {
        // cppcheck','2.7.5
         if (this.checkToolExist("cppcheck")) {
            // pass 
            this.out.writeOut("cppcheck already present.");
            this.cppcheck = new CppCheck(this.exec,"cppcheck");
            return Promise.resolve();
        }
        else {
            let cppcheckPath = path.join(this.toolInstallPath,"cppcheck","bin","cppcheck");
            const cppcheckPkg = new InstallationPkg();
            cppcheckPkg.installStrategy = "conan";
            cppcheckPkg.location = this.toolInstallPath;
            cppcheckPkg.name = "cppcheck";
            cppcheckPkg.version = "2.7.5";
            return (this.inst.installPkg(cppcheckPkg).then( async() => {
                this.cppcheck = new CppCheck(this.exec,cppcheckPath);
            }));
        }
    }

    public async installDoxygen() : Promise<void> {
        let doxygenPath = "";
        // doxygen','1.9.1
        if (this.checkToolExist("doxygen")) {
            // pass 
            this.out.writeOut("doxygen already present.");
            this.doxygen = new Doxygen(this.exec,"doxygen");
            return Promise.resolve();
        }
        else {
            doxygenPath = path.join(this.toolInstallPath,"doxygen","bin","doxygen");
            const doxygenPkg = new InstallationPkg();
            doxygenPkg.installStrategy = "conan";
            doxygenPkg.location = this.toolInstallPath;
            doxygenPkg.name = "doxygen";
            doxygenPkg.version = "1.9.1";
            return (this.inst.installPkg(doxygenPkg).then( async() => {
                    this.doxygen = new Doxygen(this.exec,doxygenPath);
                }));
        }
    }

    public async installAllTools() : Promise<void[]> {
        return Promise.all([
            this.installMetrixpp(),
            this.installCMake(),
            this.installCppCheck(),
            this.installDoxygen()
        ]);
    }

}