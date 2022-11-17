/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as fse from 'fs-extra';
import * as url from 'url';

import { Executor } from '../executor';
import { InvalidPathError} from '../Error/wrong-dir-error';

export class Doxygen {

    private exec : Executor;
    
    private doxygenBin : string;

    private doxyConfigContentPath : string;

    constructor(
        exec : Executor,
        doxygenBin : string) {
        this.exec = exec;
        this.doxygenBin = doxygenBin;
        this.doxyConfigContentPath = path.join(
            __filename,
            "..",
            "..",
            "Templates",
            "doxy.conf"
            );
    }

    public generateConf(doxyConfDstFile : string) : Promise<void> {
        if (!fse.existsSync(path.dirname(doxyConfDstFile))) {
            throw new InvalidPathError("Parent folder of doxyConfDstFile does not exist.");
        }
        return fse.readFile(this.doxyConfigContentPath).then( (content)=> (fse.writeFile(doxyConfDstFile,content)));
    }
    
    public async generateDocumentation(
        doxygenFile : string, 
        dstDir : string) : Promise<void> {
            
        if (!fse.existsSync(dstDir)) {
            throw new InvalidPathError("dstDir does not exist.");
        }
        const cmd = this.doxygenBin;
        const args = [
            `${doxygenFile}`
        ];
        return this.exec.execAsync(cmd, args, dstDir);
    }
}