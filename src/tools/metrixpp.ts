/* eslint-disable unicorn/prefer-module */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable unicorn/import-style */
import * as fse from 'fs-extra';
import * as path from 'path';

import {Executor} from '../executor';

export class Metrixpp {

    private exec : Executor;

    protected configContent : string;

    constructor(
        exec : Executor) {
        this.exec = exec;
        this.configContent = path.join(
            __filename,
            "..",
            "..",
            "Templates",
            "metrixpp.config"
            );
    }

    public async generateConfig(
        configDst : string) : Promise<void> {
            return fse.readFile(this.configContent).then( (content)=> (fse.writeFile(configDst,content)));
        }

    public collect(
        configFile : string,
        srcFolder : string) : Promise<string[]> {
        const cmd = "metrix++";
        const args = fse.readFileSync(configFile, 'utf-8').split("\n");
        args.unshift("collect");
        args.push(srcFolder);
        return this.exec.execAsyncGetFormatStdout(cmd,args,path.dirname(configFile));
    }

    public async view(
        dbFile : string,
        resultFile : string) : Promise<void> {
        const cmd = "metrix++";
        const args = [
            "view"
        ];
        const dbFolder = path.dirname(dbFile);
        const view = this.exec.execSyncGetFormatStdout(cmd, args,dbFolder);
        if (fse.existsSync(resultFile)) {
            fse.removeSync(resultFile);
        }
        const file = fse.createWriteStream(resultFile);
        file.on('error', function(err) { /* error handling */ });
        view.forEach((v) => { file.write(v + '\n'); });
        file.end();
    }
}