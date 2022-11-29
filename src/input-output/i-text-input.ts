export interface ITextInput {
    readInput(question : string, placeHolder : string) : Promise<string>;
    pickFromList(question : string, list : string[]) : Promise<string>;
    pickFromListMulti(question : string, list : string[]) : Promise<string[]>;

    readInputIfNotExist(question : string, placeHolder : string, value : string) : Promise<string>;
    pickFromListIfNotExist(question : string, list : string[], value : string) : Promise<string>;
    pickFromListMultiIfNotExist(question : string, list : string[], value : string[]) : Promise<string[]>;
    
}