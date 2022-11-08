/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/prefer-ternary */

import * as command_exists from 'command-exists';

import { ConanInstallation } from "./installation/conan-installation";
import { PipInstallation } from "./installation/pip-installation";
import { InstallationStrategie } from "./installation/installation-strategie";
import { Executor } from "./executor";
import { ITextOutput } from "./i-text-output";
import { InstallationPkg } from "./installation/installation-pkg";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export class Installer {

    protected out : ITextOutput;

    protected strategies : Map<string,InstallationStrategie>;

    constructor(out : ITextOutput) {

        this.strategies = new Map<string,InstallationStrategie>();
        this.out = out;
    }

    public async setup() : Promise<void> {

        const exec = new Executor(this.out);

        // pip3 
        const pip3 = new PipInstallation();
        pip3.setExecutor(exec);
        pip3.validateFunctionality();
        this.strategies.set("pip3",pip3);
        // conan
        try {
            const conan = new ConanInstallation();
            conan.setExecutor(exec);
            conan.validateFunctionality();
            this.strategies.set("conan",conan);
        } catch {
            await pip3.installGlobal("conan","1.54.0");
            const conan = new ConanInstallation();
            conan.setExecutor(exec);
            conan.validateFunctionality();
            this.strategies.set("conan",conan);
        }
        
    }

    public async installPkg(pkg : InstallationPkg) : Promise<void> {
        if (["pip3","conan"].includes(pkg.installStrategy)) {
            if (pkg.location === "global") {
                this.strategies.get(pkg.installStrategy).installGlobal(
                    pkg.name,
                    pkg.version
                );
            }
            else {
                this.strategies.get(pkg.installStrategy).installIAtLocation(
                    pkg.name,
                    pkg.version,
                    pkg.location
                );
            }
        }
        else {
            throw new Error("no valid pkg strategy");
        }
    }

}