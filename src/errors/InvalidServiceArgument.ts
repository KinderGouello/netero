export class InvalidServiceArgument extends Error {
  constructor(serviceName: string, arg: string) {
    super(`[${serviceName}]: @${arg} must be a valid service reference`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
