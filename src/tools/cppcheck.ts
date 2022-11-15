/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import * as path from 'path';

import { Executor } from '../executor';

export class CppCheck {

    private exec : Executor;
    
    private cppcheckBin : string;

    constructor(
        exec : Executor,
        cppcheckBin : string) {
        
        this.exec = exec;
        this.cppcheckBin = cppcheckBin;
    }

    public generateReportXML(
        sourceDir : string,
        reportFile : string) : Promise<void> {
        const cmd = this.cppcheckBin;
        const args = [
            "--force",
            "--enable=all",
            "--xml",
            "--xml-version=2",
            `--output-file=${reportFile}`,
            `${sourceDir}`
        ];
        const workDir = path.dirname(sourceDir);
        return this.exec.execAsync(cmd, args, workDir);
    }

    public convertXML2HTml(
        sourceDir : string,
        xmlReportFile : string,
        outDst : string) : Promise<void> {
        //"cppcheck-htmlreport --source-dir=. --title=VIMs_SRC --file=report-src.xml --report-dir=VIMs_SRC"
        const cmd = `${this.cppcheckBin}-htmlreport`;
        const args = [
            `--source-dir=${sourceDir}`,
            `--file=${xmlReportFile}`,
            `--report-dir=${outDst}`
        ];
        const workDir = path.dirname(sourceDir);
        return this.exec.execAsync(cmd, args, workDir);
    }

    public generateReportText(
        sourceDir : string,
        reportFile : string) : Promise<void> {
        const cmd = this.cppcheckBin;
        const args = [
            "--force",
            "--enable=all",
            `--output-file=${reportFile}`,
            `${sourceDir}`
        ];
        const workDir = path.dirname(sourceDir);
        return this.exec.execAsync(cmd, args, workDir);
    }

    public srcDirHasError(
        sourceDir : string) : boolean {
        const cmd = this.cppcheckBin;
        const args = [
            "--force",
            `${sourceDir}`
        ];
        const buffer = this.exec.execSyncGetBuffer(cmd,args);
        return buffer.stderr.toString() !== "";
    }
}
