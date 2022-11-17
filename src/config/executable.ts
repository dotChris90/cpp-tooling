export class Executable {

    name = "";

    src : string[] = [];

    inc : string[] = [];

    public constructor(init?: Partial<Executable>) {
        Object.assign(this, init);
     }
}