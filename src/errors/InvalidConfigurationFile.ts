export class InvalidConfigurationFile extends Error {
  constructor(filePath: string, errors: any) {
    super(`[${filePath}]: file not well formatted`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
