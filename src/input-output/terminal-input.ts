/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable class-methods-use-this */
import {terminal } from "terminal-kit";
import { ITextInput } from "./i-text-input";

export class TerminalInput implements ITextInput {

    readInput(question: string, placeHolder: string): Promise<string> {
        return terminal.inputField({default : placeHolder},() => terminal.green(question)).promise;
    }
    
    pickFromList(question: string, list: string[]): Promise<string> {
        terminal.clear();
        terminal.green(question);

        return new Promise<string>((resolve) => {
            terminal.singleColumnMenu(list,(error,response) => resolve(response.selectedText));
        });
    }

    pickFromListMulti(question: string, list: string[]): Promise<string[]> {
        terminal.clear();
        terminal.green(question);

        list.push("Finish");

        return new Promise<string[]>((resolve) => {
            let stillSelecting = true;
            const results = new Array<string>();
            while(stillSelecting) {
                terminal.singleColumnMenu(list,(error,response) => {
                    stillSelecting = !(response.selectedText === "Finish");
                    if (stillSelecting) {
                        results.push(response.selectedText);
                    }
                });
            }
            resolve(results);
        });
    }
    
}