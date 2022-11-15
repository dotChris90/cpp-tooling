export class CmdNotPresentError extends Error {

    constructor(message: string) {
        super(message);
    
        Object.setPrototypeOf(this, CmdNotPresentError.prototype);
      }
}