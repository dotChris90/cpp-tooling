/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable class-methods-use-this */
import {terminal } from "terminal-kit";
import { ITextInput } from "./i-text-input";

export class TerminalInput implements ITextInput {

    async readInputIfNotExist(question: string, placeHolder: string, value: string): Promise<string> {
        if (value === "") {
            return (this.readInput(question,placeHolder));
        }
        return new Promise<string>( (resolve) => resolve(value));
    }

    pickFromListIfNotExist(question: string, list: string[], value: string): Promise<string> {
        if (value === "") {
            return (this.pickFromList(question,list));
        }
        return new Promise<string>( (resolve) => resolve(value));
    
    }

    pickFromListMultiIfNotExist(question: string, list: string[], value: string[]): Promise<string[]> {
        if (value === null || value === undefined) {
            return (this.pickFromListMulti(question,list));
        }
        return new Promise<string[]>( (resolve) => resolve(value));
        
    }

    readInput(question: string, placeHolder: string): Promise<string> {
        terminal.green(question);
        return new Promise<string>((resolve) => {
            terminal.inputField({default : placeHolder},( error , input ) => {
                terminal.nextLine(1);
                resolve(input)
            });
        });
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