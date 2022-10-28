import { FakeOut } from './i-text-output-buffer'

describe('textout', () => {
    describe('test', () => {
        it('should fill buffer', () => {
            const out = new FakeOut();

            expect(out.bufferErr.length).toEqual(0);
            expect(out.bufferOut.length).toEqual(0);
            expect(out.bufferWarn.length).toEqual(0);

            out.writeOut("1");
            out.writeOut("2");
            expect(out.bufferOut.length).toEqual(2);
            expect(out.bufferOut[0]).toEqual("1");
            expect(out.bufferOut[1]).toEqual("2");

            out.clear();
            expect(out.bufferOut.length).toEqual(0);
        });
    });
});