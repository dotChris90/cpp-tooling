export interface ITextOutput {
    writeOut(text: string): void;
    writeErr(text: string): void;
    writeWarn(text : string) : void;
    clear() : void;
}