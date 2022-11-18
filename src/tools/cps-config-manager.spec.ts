/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as fse from 'fs-extra';
import * as os from 'os';
import { CPSConfigManager } from './cps-config-manager';



describe('textout', () => {
    describe('test', () => {
        it('if it parse yml file and write 2nd one then content same', async() => {
            
            const cpsFile = path.join(
                __filename,
                "..",
                "..",
                "Templates",
                "cps.yml"
                );

            const tmpDir = fse.mkdtempSync(path.join(os.tmpdir(), "cps_"));
            fse.mkdirpSync(tmpDir);

            const cpsFile2 = path.join(tmpDir,"cps.yml");

            const manager = new CPSConfigManager(cpsFile);
            manager.parse();
            manager.writeToFile(cpsFile2);

            // content of file1 and file2 same
            expect(fse.readFileSync(cpsFile).toString()).toBe(fse.readFileSync(cpsFile2).toString());

            fse.rmSync(tmpDir,{ recursive: true, force: true });
            expect(1).toBe(1);
            
        });
        it('shall extend file', async() => {
            
            const cpsFile = path.join(
                __filename,
                "..",
                "..",
                "Templates",
                "cps.yml"
                );

            const manager = new CPSConfigManager(cpsFile);
            manager.parse();

            

            expect(1).toBe(1);
        });
    });
});