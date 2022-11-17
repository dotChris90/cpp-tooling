export class InvalidPathError extends Error {

    constructor(message: string) {
        super(message);
    
        Object.setPrototypeOf(this, InvalidPathError.prototype);
      }
}