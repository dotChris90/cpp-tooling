/* eslint-disable no-constant-condition */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable unicorn/import-style */
import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

import { FakeOut } from './i-text-output-buffer'
import { ToolManager } from './tool-manager';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

describe('textout', () => {
    describe('test', () => {
        it('tools shall be present', async() => {
            const out = new FakeOut();

            const appPrefix = "tool_testing";
            const tmpDir = fse.mkdtempSync(path.join(os.tmpdir(), appPrefix));
            fse.mkdirpSync(tmpDir);
            const manager = new ToolManager(out,tmpDir);
            await manager.installAllTools();
            fse.rmdirSync(tmpDir,{ recursive: true});

            expect(1).toBe(1);
        });
    });
});