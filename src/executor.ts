import * as child_process from 'child_process';
import { ITextOutput } from './i-text-output';

export class Executor {
  private output: ITextOutput;

  constructor(output: ITextOutput) {
    this.output = output;
  }

  // required since some classes like cppcheck need the output for error check
  public execSyncGetBuffer(
    command : string, 
    args : string[] 
    ) : child_process.SpawnSyncReturns<Buffer> {
      this.output.writeOut("");
      return child_process.spawnSync(command, args);
  }
  
  public execSyncGetResult(
    command: string, 
    args: string[] = [""], 
    workingDir = "", 
    options : child_process.ExecSyncOptionsWithStringEncoding
    ) : Promise<string[]> {
        this.output.clear();
        const CWD = workingDir === "" ? process.cwd() : workingDir;
        const options2 = options;
        options2.cwd = CWD;
        let out = "";
        out = args === [""] ? child_process.execSync(command,options).toString() : child_process.spawnSync(command,args,options2).stdout.toString();
        const bufferSplitted = out.split("\n").filter(text => text !== '');
        const bufferPromise: Promise<string[]> = new Promise((resolve, reject) => resolve(bufferSplitted));
        return bufferPromise;
  }
  
  public exec(
    command: string, 
    args: string[], 
    workingDir = "", 
    options : child_process.ExecSyncOptionsWithStringEncoding
    ) : Promise<void> {
    const workingDir2 = workingDir === "" ? process.cwd() : workingDir;
    const options2 = options;
    return new Promise((resolve, reject) => {
      options2.cwd = workingDir2;
      options2.shell = "true";
      const commandProc = child_process.spawn(command, args, options);
      commandProc.stdout.on("data", (data) => {
        this.output.writeOut(data.toString());
      });
      commandProc.stderr.on("data", (data) => {
        this.output.writeErr(data.toString());
      });
      commandProc.on('exit', () => {
  
      });
      commandProc.on('error', (err) => {
        reject(err);
      });
    });
  }
}

