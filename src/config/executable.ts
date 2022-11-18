export class Executable {

    name = "";

    src : string[] = [];

    req : string[] = [];

    public constructor(init?: Partial<Executable>) {
        Object.assign(this, init);
     }
}