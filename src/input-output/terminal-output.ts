/* eslint-disable class-methods-use-this */
import { terminal } from "terminal-kit";
import { ITextOutput } from "./i-text-output";

export class TerminalOutput implements ITextOutput{

    writeOut(text: string): void {
        terminal(text);
    }

    writeErr(text: string): void {
        terminal.red(text);
    }

    writeWarn(text: string): void {
        terminal.yellow(text);
    }

    clear(): void {
        terminal.clear();   
    }
}