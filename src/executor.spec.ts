import * as child_process from 'child_process';

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
    });
});