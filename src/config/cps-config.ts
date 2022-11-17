/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import * as js_yaml from 'js-yaml';
import * as fse from 'fs-extra';

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

    public constructor(init?: Partial<CPSConfig>) {
        Object.assign(this, init);
        for(let idx = 0; idx < this.packages.length;idx++) {
            this.packages[idx] = new Package(this.packages[idx]);
        }
        for(let idx = 0; idx < this.options.length;idx++) {
            this.options[idx] = new Option(this.options[idx]);
        }
        for(let idx = 0; idx < this.executables.length;idx++) {
            this.executables[idx] = new Executable(this.executables[idx]);
        }
        for(let idx = 0; idx < this.libraries.length;idx++) {
            this.libraries[idx] = new Library(this.libraries[idx]);
        }
     }

     public static createFromYMLFile(filePath : string) : CPSConfig {
        const partialConfig = js_yaml.load(fse.readFileSync(filePath, 'utf8')) as CPSConfig;
        return (new CPSConfig(partialConfig));
     }

     public static writeToYMLFile(filePath : string, config : CPSConfig) : void {
        fse.writeFileSync(filePath, js_yaml.dump(config,{skipInvalid : true}),'utf8');
     }
}