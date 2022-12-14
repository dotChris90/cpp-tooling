import * as command_exists from 'command-exists';

import { Executor } from "../executor";
import { InstallationStrategie } from "./installation-strategie";
import { ValidationError } from '../Error/validation-error';

export class ConanInstallation implements InstallationStrategie {

    validateFunctionality(): void {
        let cmdExists = false;
        let versionIsWrong = false;
        if (command_exists.sync("conan")) {
            const version = this.exec.execSyncGetFormatStdout("conan",["--version"])[0].split(" ")[2].split(".");
            const major = version[0] as unknown as number;
            const minor = version[1] as unknown as number;
            if (major >= 1 && minor >= 50 ) {
                cmdExists = true;
            }
            else {
                cmdExists = true;
                versionIsWrong = true;
            }
        }
        if (cmdExists) {
            if (versionIsWrong) {
                throw new ValidationError("conan command is too old - please upgrade to 1.54.0");
            }
        }
        else {
            throw new ValidationError("conan command is missing - please install manually");
        }
    }
    
    protected exec : Executor;

    setExecutor(exec: Executor): void {
        this.exec = exec;
    }
    
    installGlobal(name : string, version : string): Promise<void> {
        const cmd = "conan";
        const args = [
            "install", 
            `${name}/${version}@_/_`,
            "--build=missing"
        ];
        return this.exec.execAsync(cmd,args);
    }

    installIAtLocation(name : string, version : string, location : string) : Promise<void> {
        const cmd = "conan";
        const args = [
            "install", 
            "--generator=deploy",
            `--install-folder=${location}`,
            `${name}/${version}@_/_`,
            "--build=missing"
        ];
        return this.exec.execAsync(cmd,args);
    }
}