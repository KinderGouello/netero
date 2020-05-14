export class NoClassDeclared extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: No class found for this file`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
