/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as process from 'process';
import * as commandExists from 'command-exists';
import * as utilsExt from '@dotchris90/utils-extensions';
import * as os from 'os';
import * as fs from 'fs';

import { Installer } from "./installer";
import { ITextOutput } from "./i-text-output";

import { InstallationPkg } from "./installation/installation-pkg";

export class ToolManager {
    
    protected inst : Installer;
    
    protected toolInstallPath : string;

    constructor(
        out : ITextOutput, 
        toolInstallPath = path.join(process.cwd(),".tools")
        ) {
        this.inst = new Installer(out);
        if (!fs.existsSync(toolInstallPath)) {
            throw new Error("Path does not exist");
        }
        this.toolInstallPath = toolInstallPath;
    }

    protected async checkToolExist(toolcommand : string) : Promise<boolean> {
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

    public async installAllTools() : Promise<void> {
        // metrixpp 1.7.1 pip3 
        if (await this.checkToolExist("metrix++")) {
            // pass 
        }
        else {
            const cmakePkg = new InstallationPkg();
            cmakePkg.installStrategy = "pip3";
            cmakePkg.location = this.toolInstallPath;
            cmakePkg.name = "metrixpp";
            cmakePkg.version = "1.7.1";
            this.inst.installPkg(cmakePkg);
        }
        
        // cmake','3.23.1
        if (await this.checkToolExist("cmake")) {
            // pass 
        }
        else {
            const cmakePkg = new InstallationPkg();
            cmakePkg.installStrategy = "conan";
            cmakePkg.location = this.toolInstallPath;
            cmakePkg.name = "cmake";
            cmakePkg.version = "3.23.1";
            this.inst.installPkg(cmakePkg);
        }

        // cppcheck','2.7.5
        if (await this.checkToolExist("cppcheck")) {
            // pass 
        }
        else {
            const cmakePkg = new InstallationPkg();
            cmakePkg.installStrategy = "conan";
            cmakePkg.location = this.toolInstallPath;
            cmakePkg.name = "cppcheck";
            cmakePkg.version = "2.7.5";
            this.inst.installPkg(cmakePkg);
        }

        // doxygen','1.9.1
        if (await this.checkToolExist("doxygen")) {
            // pass 
        }
        else {
            const cmakePkg = new InstallationPkg();
            cmakePkg.installStrategy = "conan";
            cmakePkg.location = this.toolInstallPath;
            cmakePkg.name = "doxygen";
            cmakePkg.version = "1.9.1";
            this.inst.installPkg(cmakePkg);
        }
    }

}