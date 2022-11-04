import * as command_exists from 'command-exists';

import { Executor } from "../executor";
import { InstallationStrategie } from "./installation-strategie";
import { ValidationError } from '../Error/validation-error';

export class ConanInstallation implements InstallationStrategie {

    validateFunctionality(): void {
        let cmdExists = false;
        if (command_exists.sync("conan")) {
            const version = this.exec.execSyncGetFormatStdout("conan",["--version"])[0].split(" ")[2].split(".");
            const major = version[0] as unknown as number;
            const minor = version[1] as unknown as number;
            if (major >= 1 && minor >= 50 ) {
                cmdExists = true;
            }
        }
        if (cmdExists) {
            // pass 
        }
        else {
            throw new ValidationError("conan command is missing - please install manually");
        }
    }
    
    protected exec : Executor;

    setExecutor(exec: Executor): void {
        this.exec = exec;
    }
    
    installGlobal(name : string, version : string): void {
        const cmd = "conan";
        const args = [
            "install", 
            `${name}/${version}@_/_`,
            "--build=missing"
        ];
        this.exec.execSync(cmd,args);
    }

    installIAtLocation(name : string, version : string, location : string) : void {
        const cmd = "conan";
        const args = [
            "install", 
            "--generator=deploy",
            `--install-folder=${location}`,
            `${name}/${version}@_/_`,
            "--build=missing"
        ];
        this.exec.execSync(cmd,args);
    }
}