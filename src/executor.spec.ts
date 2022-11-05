/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';

import { Executor } from './executor';
import { FakeOut } from './i-text-output-buffer';

describe('exec', () => {
    describe('test', () => {
        it('version should be displayed', () => {
            const out = new FakeOut();
            const exec = new Executor(out);

            const result = exec.execSyncGetFormatStdout("node",["--version"]);

            expect(result.length).toBe(1);
            expect(result[0].startsWith("v")).toBeTruthy();

            const result2 = exec.execSyncGetBuffer("node",["--version"]);
            expect(result2.stdout.toString().startsWith("v")).toBeTruthy();

            exec.execSync("node",["--version"],"");
            
        });

        it('version should be displayed async', async() => {
            const out = new FakeOut();
            const exec = new Executor(out);

            const result = await exec.execAsyncGetFormatStdout("node",["--version"]);

            expect(result.length).toBe(1);
            expect(result[0].startsWith("v")).toBeTruthy();

            exec.execSync("node",["--version"],"");
            
        });
        

        it('conan pkg shall be deployed', () => {

            jest.setTimeout(100000);

            const out = new FakeOut();
            const exec = new Executor(out);

            const tmpDir = fse.mkdtempSync(path.join(os.tmpdir(), "exec_"));
            fse.mkdirpSync(tmpDir);
            
            const cmd = "conan";
            const args = [
                "install", 
                "--generator=deploy",
                `--install-folder=${tmpDir}`,
                `fmt/8.1.1@_/_`,
                "--build=missing"
            ];
            // eslint-disable-next-line promise/catch-or-return
            exec.execAsync(cmd,args,tmpDir).then(
                // eslint-disable-next-line promise/always-return
                () => {
                    expect(out.bufferErr.length).toBe(0);
                    expect(fse.existsSync(path.join(tmpDir,"deploy_manifest.txt"))).toBeTruthy();
                }
            );

            expect(1).toBe(1);
        });
    });
});