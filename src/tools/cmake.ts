/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as fse from 'fs-extra';

import { Executor } from '../executor';

export class CMake {

    private exec : Executor;
    
    private cmakeBin : string;

    constructor(
        exec : Executor,
        cmakeBin : string) {
        this.exec = exec;
        this.cmakeBin = cmakeBin;
    }

    public getAllCMakeOptions(
        cmakeFile: string,
        buildDir : string) : string[] {
        this.exec.execSync(
            this.cmakeBin,
            [cmakeFile],
            buildDir
        );
        return (this.exec.execSyncGetFormatStdout(
            this.cmakeBin,
            ["-LA"],
            buildDir
        ));    
    }

    public async generateDot(
        cmakeFile : string,
        dstDotFile : string) : Promise<void> {
        const  cmd = this.cmakeBin;
        const args = [
            `-S`,
            `${path.dirname(cmakeFile)}`,
            `--graphviz=${dstDotFile}`
        ];
        const workDir = process.cwd();
        return this.exec.execAsync(cmd, args,workDir);
    }
}
