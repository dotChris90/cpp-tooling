export class Library {

    name = "";

    src : string[] = [];

    inc : string[] = [];

    req : string[] = [];

    public constructor(init?: Partial<Library>) {
        Object.assign(this, init);
     }
}