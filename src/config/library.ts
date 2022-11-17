export class Library {

    name = "";

    src : string[] = [];

    inc : string[] = [];

    public constructor(init?: Partial<Library>) {
        Object.assign(this, init);
     }
}