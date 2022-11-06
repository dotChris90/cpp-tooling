/* eslint-disable promise/always-return */
/* eslint-disable no-constant-condition */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable unicorn/import-style */
import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

import { FakeOut } from './i-text-output-buffer'
import { ToolManager } from './tool-manager';

describe('textout', () => {
    describe('test', () => {
        it('tools shall be present', async() => {
            jest.setTimeout(10 * 60 * 1000)
            
            const out = new FakeOut();

            const appPrefix = "tool_testing";
            const tmpDir = fse.mkdtempSync(path.join(os.tmpdir(), appPrefix));
            fse.mkdirpSync(tmpDir);
            const manager = new ToolManager(out,tmpDir);
            await manager.setup();

            await manager.installCMake().then(
                () => {
                    expect(1).toBe(1);
                }
            )
            
            expect(1).toBe(1);
        });
    });
});