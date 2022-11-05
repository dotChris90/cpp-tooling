import { Executor } from "../executor";

export interface InstallationStrategie {
    
    validateFunctionality() : void;

    setExecutor( exec : Executor) : void;

    installIAtLocation(name : string, version : string, path : string) : Promise<void>;

    installGlobal(name : string, version : string) : Promise<void>;
}