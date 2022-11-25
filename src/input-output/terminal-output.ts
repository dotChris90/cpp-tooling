/* eslint-disable class-methods-use-this */
import { terminal } from "terminal-kit";
import { ITextOutput } from "./i-text-output";

export class TerminalOutput implements ITextOutput{

    writeOut(text: string): void {
        terminal(`${text}\n`);
    }

    writeErr(text: string): void {
        terminal.red(`${text}\n`);
    }

    writeWarn(text: string): void {
        terminal.yellow(`${text}\n`);
    }

    clear(): void {
        terminal.clear();   
    }
}