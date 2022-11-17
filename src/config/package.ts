export class Package {

    name = "";

    version = "";

    type = "";

    options = new Map<string,string>();

    public constructor(init?: Partial<Package>) {
        Object.assign(this, init);
     }
}