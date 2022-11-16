/* eslint-disable no-param-reassign */
import { ValidationError } from "../Error/validation-error";
import { Executable } from "./executable";
import { Library } from "./library";
import { Option } from "./option";
import { Package } from "./package";

export class CPSConfig {
    
    name = "";
    
    version = "";

    buildSystem = "";

    license = "";

    author = "";

    url = "";

    description = "";

    topics : string[] = [];

    options : Option[] = [];

    packages : Package[] = [];

    executables : Executable[] = [];

    libraries : Library[] = [];

    public static Validate(config : CPSConfig) : void {
        if (config.name === undefined) {
            config.name = "";
        }
        if (config.version === undefined) {
            config.version = "";
        }
        if (config.buildSystem === undefined) {
            config.buildSystem = "";
        }
        if (config.license === undefined) {
            config.license = "";
        }
        if (config.author === undefined) {
            config.author = "";
        }
        if (config.url === undefined) {
            config.url = "";
        }
        if (config.description === undefined) {
            config.description = "";
        }
        if (config.topics === undefined) {
            config.topics = [];
        }
        if (config.options === undefined) {
            config.options = [];
        }
        if (config.packages === undefined) {
            config.packages = [];
        }
        if (config.executables === undefined) {
            config.executables = [];
        }
        if (config.libraries === undefined) {
            config.libraries = [];
        }
    }
}