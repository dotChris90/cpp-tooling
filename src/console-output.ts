/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

import {ITextOutput} from './input-output/i-text-output';

export class ConsoleOutput implements ITextOutput {
    
    writeOut(text: string): void {
        console.log("%s \n",text);
    }
    
    writeErr(text: string): void {
        console.log("%s \n",text);
    }
    
    writeWarn(text: string): void {
        console.log("%s \n",text);
    }

    clear(): void {
    }

}