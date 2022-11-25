/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable unicorn/no-object-as-default-parameter */
import * as child_process from 'child_process';
import { ITextOutput } from './input-output/i-text-output';

export class Executor {

  private output: ITextOutput;

  constructor(output: ITextOutput) {
    this.output = output;
  }
  
  public execSyncGetFormatStdout(
    command: string, 
    args: string[] = [""], 
    workingDir = "", 
    options : child_process.ExecSyncOptionsWithStringEncoding = {encoding : "utf8"}
    ) : string[]{
      
        const CWD = workingDir === "" ? process.cwd() : workingDir;
        const options2 = options;
        options2.cwd = CWD;
        let out = "";
        out =child_process.spawnSync(command,args,options2).stdout.toString();
        const bufferSplitted = out.split("\n").filter(text => text !== '');
        return bufferSplitted;
  }

  public execAsyncGetFormatStdout(
    command: string, 
    args: string[] = [""], 
    workingDir = "", 
    options : child_process.ExecSyncOptionsWithStringEncoding = {encoding : "utf8"}
    ) : Promise<string[]> {
        this.output.clear();
        const CWD = workingDir === "" ? process.cwd() : workingDir;
        const options2 = options;
        options2.cwd = CWD;
        let out = "";
        out = child_process.spawnSync(command,args,options2).stdout.toString();
        const bufferSplitted = out.split("\n").filter(text => text !== '');
        const bufferPromise: Promise<string[]> = new Promise((resolve) => resolve(bufferSplitted));
        return bufferPromise;
  }

  
  public execAsync(
    command: string, 
    args: string[], 
    workingDir = "", 
    options: any = {}
    ) : Promise<any> {
    workingDir = workingDir === "" ? process.cwd() : workingDir;
    return new Promise((resolve, reject) => {
      options['cwd'] = workingDir;
      options['shell'] = true;
      const commandProc = child_process.spawn(command, args, options);
      commandProc.stdout.on("data", (data) => {
        this.output.writeOut(data.toString());
      });
      commandProc.stderr.on("data", (data) => {
        this.output.writeErr(data.toString());
      });
      commandProc.on('exit', function (code) {
        // *** Process completed
        resolve(code);
      });
      commandProc.on('error', function (err) {
        // *** Process creation failed
        reject(err);
      });
    });
  }

  public execSync(
    command: string, 
    args: string[], 
    workingDir = "", 
    options : child_process.ExecSyncOptionsWithStringEncoding = {encoding : "utf8"}
    ) : void {
      const workingDir2 = workingDir === "" ? process.cwd() : workingDir;
      const options2 = options;
      options2.cwd = workingDir2;
      options2.shell = "true";

      const out = child_process.spawnSync(command, args, options);

      this.output.writeOut(out.stdout);
      this.output.writeErr(out.stderr);
    }

  // required since some classes like cppcheck need the output for error check
  public execSyncGetBuffer(
    command : string, 
    args : string[] 
    ) : child_process.SpawnSyncReturns<Buffer> {
      this.output.writeOut("");
      return child_process.spawnSync(command, args);
  }

    // required since some classes like cppcheck need the output for error check
  public execAsyncGetBuffer(
      command : string, 
      args : string[] 
      ) : child_process.ChildProcessWithoutNullStreams {
        this.output.writeOut("");
        return child_process.spawn(command, args);
    }
}

