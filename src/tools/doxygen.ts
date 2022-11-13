/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as fse from 'fs-extra';
import * as url from 'url';

import { Executor } from '../executor';
import { InvalidDirError} from '../Error/wrong-dir-error';

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
            url.fileURLToPath(import.meta.url),
            "..",
            "..",
            "Templates",
            "doxy.conf"
            );
    }

    public generateConf(doxyConfDstFile : string) : Promise<void> {
        if (!fse.existsSync(this.doxygenBin)) {
            throw new InvalidDirError("doxygen bin does not exist.");
        }
        if (!fse.existsSync(path.dirname(doxyConfDstFile))) {
            throw new InvalidDirError("Parent folder of doxyConfDstFile does not exist.");
        }
        return fse.readFile(this.doxyConfigContentPath).then( (content)=> (fse.writeFile(doxyConfDstFile,content)));
    }
    
    public async generateDocumentation(
        doxygenFile : string) : Promise<void> {
        const cmd = this.doxygenBin;
        const args = [
            `${doxygenFile}`
        ];
        const workDir = path.dirname(doxygenFile);
        return this.exec.execAsync(cmd, args, workDir);
    }
}