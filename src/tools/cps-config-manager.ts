/* eslint-disable no-plusplus */
import { CPSConfig } from '../config/cps-config';
import { InvalidPathError } from '../Error/wrong-dir-error';

export class CPSConfigManager {
    
    protected filePath : string;

    protected config : CPSConfig;

    constructor(filePath : string) {
        this.filePath = filePath;
    }

    public parse() : void {
        if (this.filePath === "") {
            throw new InvalidPathError("File is empty string - cannot parse");
        }
        else {
            this.config = CPSConfig.createFromYMLFile(this.filePath);
        }
    }

    public writeToFile(filePath : string) : void {
        CPSConfig.writeToYMLFile(filePath,this.config);
    }
    
}