/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';

import { FakeOut } from '../i-text-output-buffer'
import { Doxygen } from './doxygen';
import { Executor } from '../executor';
import { ToolManager } from '../tool-manager';

describe('textout', () => {
    describe('test', () => {
        it('should generate doxyconf', async() => {
            const out = new FakeOut();

            const exec = new Executor(out);

            const tmpDir = fse.mkdtempSync(path.join(os.tmpdir(), "exec_"));
            fse.mkdirpSync(tmpDir);

            const manager = new ToolManager(out,tmpDir);
            await manager.setup();

            const doxy = new Doxygen(exec, "doxygen");
            await doxy.generateConf(path.join(tmpDir,"doxy.conf"));

            expect(fse.existsSync(path.join(tmpDir,"doxy.conf"))).toBeTruthy();

            fse.rmSync(tmpDir, { recursive: true, force: true });
            
        });
    });
});