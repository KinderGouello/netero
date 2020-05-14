export class InvalidParameterArgument extends Error {
  constructor(serviceName: string, arg: string) {
    super(`[${serviceName}]: %${arg}% must be a valid parameter reference`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
