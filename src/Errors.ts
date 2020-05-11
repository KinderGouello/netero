export class ServiceAlreadyDeclared extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: Service already declared`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ParameterAlreadyDeclared extends Error {
  constructor(parameterName: string) {
    super(`[${parameterName}]: Parameter already declared`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoClassDeclared extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: No class found for this file`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServiceNotExist extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: Service does not exist`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidServiceArgument extends Error {
  constructor(serviceName: string, arg: string) {
    super(`[${serviceName}]: @${arg} must be a valid service reference`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidParameterArgument extends Error {
  constructor(serviceName: string, arg: string) {
    super(`[${serviceName}]: %${arg}% must be a valid parameter reference`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidServiceAlias extends Error {
  constructor(serviceName: string) {
    super(`[${serviceName}]: should start with "@"`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidConfigurationFile extends Error {
  constructor(filePath: string, errors: any) {
    console.error(errors);
    super(`[${filePath}]: file not well formatted`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
