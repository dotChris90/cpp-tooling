/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as fse from 'fs-extra';

import { Executor } from '../executor';
import { InvalidDirError} from '../Error/wrong-dir-error';

export class Clang {

    private exec : Executor;
    
    private clangBin : string;

    private clangTemplateDir : string;

    constructor(
        exec : Executor,
        clangBin : string) {
        this.exec = exec;
        this.clangBin = clangBin;
        this.clangTemplateDir = path.join(
            __filename,
            "..",
            "..",
            "Templates"
            );
    }

    public generateClangTidy(clangTidyDst : string) : Promise<void> {
        if (!fse.existsSync(path.dirname(clangTidyDst))) {
            throw new InvalidDirError("Parent folder of clangTidyDst does not exist.");
        }
        const clangTidyContent = path.join(this.clangTemplateDir,".clang-tidy");
        return fse.readFile(clangTidyContent).then( (content)=> (fse.writeFile(clangTidyDst,content)));
    }

    public generateClangFormat(clangFormatDst : string) : Promise<void> {
        if (!fse.existsSync(path.dirname(clangFormatDst))) {
            throw new InvalidDirError("Parent folder of clangFormatDst does not exist.");
        }
        const clangFormatContent = path.join(this.clangTemplateDir,".clang-format");
        return fse.readFile(clangFormatContent).then( (content)=> (fse.writeFile(clangFormatDst,content)));
    }
}