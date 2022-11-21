/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';

import { FakeOut } from '../input-output/i-text-output-buffer'
import { Executor } from '../executor';
import { ToolManager } from '../tool-manager';
import { Conan } from './conan';

describe('textout', () => {
    describe('test', () => {
        it('should generate template', async() => {
            const out = new FakeOut();

            const exec = new Executor(out);

            const tmpDir = fse.mkdtempSync(path.join(os.tmpdir(), "exec_"));
            fse.mkdirpSync(tmpDir);

            const manager = new ToolManager(out,tmpDir);
            await manager.setup();

            const conan = new Conan(exec);
            await conan.generatePkgTemplate();
            
            expect(fse.existsSync(path.join(
                os.homedir(),
                ".conan",
                "templates",
                "command",
                "new",
                "default",
                "conanfile.py"
            ))).toBeTruthy();

            fse.rmSync(tmpDir, { recursive: true, force: true });
            
        });
    });
});