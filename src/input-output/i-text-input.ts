export interface ITextInput {
    readInput(question : string, placeHolder : string) : Promise<string>;
    pickFromList(question : string, list : string[]) : Promise<string>;
    pickFromListMulti(question : string, list : string[]) : Promise<string[]>;
}