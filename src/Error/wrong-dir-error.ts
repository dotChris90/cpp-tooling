export class InvalidDirError extends Error {

    constructor(message: string) {
        super(message);
    
        Object.setPrototypeOf(this, InvalidDirError.prototype);
      }
}