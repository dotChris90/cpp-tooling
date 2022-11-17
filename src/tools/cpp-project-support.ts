/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/import-style */
import * as path from 'path';
import * as fse from 'fs-extra';
import { Executor } from '../executor';
import { ToolManager } from '../tool-manager';
import { ITextOutput } from '../i-text-output';
import { CPSConfigManager } from './cps-config-manager';

export class CppProjectSupport {

    protected toolMng : ToolManager;

    protected out : ITextOutput;

    protected projectFileParser : CPSConfigManager;

    constructor(
        out : ITextOutput,
        toolMng : ToolManager,
        projectFileParser : CPSConfigManager ) {

        this.toolMng = toolMng;
        this.out = out;
        this.projectFileParser = projectFileParser;
    }

    public async generateDefaultTemplate() : Promise<void> {
        return this.toolMng.getConan().generatePkgTemplate();
    }

}