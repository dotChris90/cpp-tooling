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

import { InstallationPkg } from "./installation/installation-pkg";
import { Executor } from './executor';

export class ToolManager {

    protected conan : Conan;

    protected doxygen : Doxygen;
    
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
        let result = Promise.resolve();
        // metrixpp 1.7.1 pip3 
        if (this.checkToolExist("metrix++")) {
            // pass 
            this.out.writeOut("metrix++ already present.");
        }
        else {
            const metrixPkg = new InstallationPkg();
            metrixPkg.installStrategy = "pip3";
            metrixPkg.location = this.toolInstallPath;
            metrixPkg.name = "metrixpp";
            metrixPkg.version = "1.7.1";
            result = this.inst.installPkg(metrixPkg);
        }
        return result;
    }

    public async installCMake() : Promise<void> {

        let result = Promise.resolve();
        // cmake','3.23.1
        if (this.checkToolExist("cmake")) {
            // pass 
            this.out.writeOut("cmake already present.");
        }
        else {
            const cmakePkg = new InstallationPkg();
            cmakePkg.installStrategy = "conan";
            cmakePkg.location = this.toolInstallPath;
            cmakePkg.name = "cmake";
            result = this.inst.installPkg(cmakePkg);
        }
        return result;
    }

    public async installCppCheck() : Promise<void> {
        let result = Promise.resolve();
        // cppcheck','2.7.5
         if (this.checkToolExist("cppcheck")) {
            // pass 
            this.out.writeOut("cppcheck already present.");
        }
        else {
            const cppcheckPkg = new InstallationPkg();
            cppcheckPkg.installStrategy = "conan";
            cppcheckPkg.location = this.toolInstallPath;
            cppcheckPkg.name = "cppcheck";
            cppcheckPkg.version = "2.7.5";
            result = this.inst.installPkg(cppcheckPkg);
        }
        return result;
    }

    public async installDoxygen() : Promise<void> {
        let result = Promise.resolve();
        // doxygen','1.9.1
        if (this.checkToolExist("doxygen")) {
            // pass 
            this.out.writeOut("doxygen already present.");
        }
        else {
            const doxygenPkg = new InstallationPkg();
            doxygenPkg.installStrategy = "conan";
            doxygenPkg.location = this.toolInstallPath;
            doxygenPkg.name = "doxygen";
            doxygenPkg.version = "1.9.1";
            result = this.inst.installPkg(doxygenPkg);
        }
        return result;
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