import { InstallationPkg } from "./installation/installation-pkg";

export interface Tool {

    getInstallationPkgGlobal() : InstallationPkg;

    getInstallationPkgLocal(location : string) : InstallationPkg;

}