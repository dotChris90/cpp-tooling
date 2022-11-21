import {ITextOutput} from './i-text-output';

export class FakeOut implements ITextOutput {

    public bufferOut : Array<string> = [];

    public bufferErr : Array<string> = [];

    public bufferWarn : Array<string> = [];

    writeOut(text: string): void {
        this.bufferOut.push(text);
    }

    writeErr(text: string): void {
        this.bufferErr.push(text);
    }

    writeWarn(text: string): void {
        this.bufferWarn.push(text);
    }

    clear(): void {
        this.bufferErr = [];
        this.bufferOut = [];
        this.bufferWarn = [];
    }
    
}