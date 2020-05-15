import { InvalidServiceAlias } from './errors/InvalidServiceAlias';

export function getServiceAlias(alias: string) {
  if (alias.charAt(0) !== '@') {
    throw new InvalidServiceAlias(alias);
  }
  return alias.substring(1);
}

export function isEs5Class(value: any): boolean {
  if (!value.prototype) return false;
  const prototypeKeys = Object.keys(value.prototype);
  return prototypeKeys.length >= 1;
}

export function isClass(value: any): boolean {
  try {
    // tslint:disable-next-line
    new value();
  } catch (error) {
    return false;
  }

  try {
    // @ts-ignore
    value.call(arguments);
    return false;
  } catch (error) {
    return true;
  }
}
