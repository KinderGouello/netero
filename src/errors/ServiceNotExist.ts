export class ServiceNotExist extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: Service does not exist`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
