export class ServiceAlreadyDeclared extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: Service already declared`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
