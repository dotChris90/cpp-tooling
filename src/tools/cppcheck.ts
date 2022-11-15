/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import { Executor } from '../executor';

export class CppCheck {

    private exec : Executor;
    
    private cppcheckBin : string;

    constructor(
        exec : Executor,
        cppcheckBin : string) {
        
        this.exec = exec;
        this.cppcheckBin = cppcheckBin;
    }
}
