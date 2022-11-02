import * as os from 'os';

export class InstallationPkg {
    public name = "conan";

    public version = "1.50.0";

    public installStrategy = "pip3";

    public location = os.tmpdir();
}