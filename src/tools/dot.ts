/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import * as command_exist from 'command-exists';
import * as path from 'path';
import * as fse from 'fs-extra';
import { Executor } from '../executor';
import { InvalidPathError } from '../Error/wrong-dir-error';
import { CmdNotPresentError } from '../Error/command-not-present-error';

export class Dot {

    private exec : Executor;
    
    private dotBin : string;

    constructor(
        exec : Executor,
        dotBin : string) {
        
        this.exec = exec;
        this.dotBin = dotBin;
    }

    public async generateSvgFromDot(
        dotFile : string, 
        dstSvgFile : string ) : Promise<void> {
        
        // it's local present
        if (this.dotBin.includes(path.sep)) {
            if (!fse.existsSync(this.dotBin)) {
                throw new InvalidPathError(`the path ${this.dotBin} does not exist`);
            }
            else {
                // pass
            }
        }
        else if (!command_exist.sync("doxygen")) {
                throw new CmdNotPresentError("the command doxygen is not present");
            }
        else {
            // pass
        }
        const cmd = this.dotBin;
        const args = [
            `-Tsvg`,
            `-o`,
            `${dstSvgFile}`,
            `${dotFile}`
        ];
        return this.exec.execAsync(cmd, args);
    }
}
