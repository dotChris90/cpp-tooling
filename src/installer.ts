
import { ConanInstallation } from "./installation/conan-installation";
import { PipInstallation } from "./installation/pip-installation";
import { InstallationStrategie } from "./installation/installation-strategie";
import { Executor } from "./executor";
import { ITextOutput } from "./i-text-output";
import { InstallationPkg } from "./installation/installation-pkg";
import { ValidationError } from "./Error/validation-error";

export class Installer {

    protected strategies : Map<string,InstallationStrategie>;

    constructor(out : ITextOutput) {

        this.strategies = new Map<string,InstallationStrategie>();
        const exec = new Executor(out);

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
            // ToDo : catch by error type
            pip3.installGlobal("conan","1.50.0");
            const conan = new ConanInstallation();
            conan.setExecutor(exec);
            conan.validateFunctionality();
            this.strategies.set("conan",conan);
        }
        
    }

    public installPkg(pkg : InstallationPkg) : void {
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