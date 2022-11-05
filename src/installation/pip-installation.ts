import * as command_exists from 'command-exists';

import { Executor } from "../executor";
import { InstallationStrategie } from "./installation-strategie";
import { ValidationError } from '../Error/validation-error';

export class PipInstallation implements InstallationStrategie {
    
    protected exec : Executor;

    validateFunctionality(): void {
        let cmdExists = false;
        if (command_exists.sync("pip3")) {
            const version = this.exec.execSyncGetFormatStdout("pip3",["--version"])[0].split(" ")[1].split(".");
            const major = version[0] as unknown as number;
            const minor = version[1] as unknown as number;
            if (major >= 20 && minor >= 0 ) {
                cmdExists = true;
            }
        }
        if (cmdExists) {
            // pass 
        }
        else {
            throw new ValidationError("pip3 command is missing - please install manually");
        }
    }

    setExecutor(exec: Executor): void {
        this.exec = exec;
    }
    
    installGlobal(name : string, version : string): Promise<void> {
        const cmd = "pip3";
        const args = [
            "install", 
            "-I",
            `${name}==${version}`
        ];
        return this.exec.execAsync(cmd,args);
    }

    installIAtLocation(name : string, version : string, location : string) : Promise<void> {
        const cmd = "pip3";
        const args = [
            "install", 
            `--target=${location}`,
            "-I",
            `${name}==${version}`
        ];
        return this.exec.execAsync(cmd,args);   
    }

}