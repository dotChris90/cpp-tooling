export class Option {

    name = "";

    values : string[] = [];

    default = "";

    public constructor(init?: Partial<Option>) {
        Object.assign(this, init);
     }

}