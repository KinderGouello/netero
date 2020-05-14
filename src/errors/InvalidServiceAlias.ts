export class InvalidServiceAlias extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: should start with "@"`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
