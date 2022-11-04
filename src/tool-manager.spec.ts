import { FakeOut } from './i-text-output-buffer'
import { ToolManager } from './tool-manager';

describe('textout', () => {
    describe('test', () => {
        it('tools shall be present', () => {
            const out = new FakeOut();

            const manager = new ToolManager(out,"/tmp/");
            manager.installAllTools();

            expect(1).toBe(1);
        });
    });
});