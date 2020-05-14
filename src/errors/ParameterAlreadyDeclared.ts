export class ParameterAlreadyDeclared extends Error {
  constructor(parameterName: string) {
    super(`[${parameterName}]: Parameter already declared`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
