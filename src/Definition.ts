import { NoClassDeclared } from './errors/NoClassDeclared';
import { isClass, isEs5Class } from './Util';

export class Definition {
  private classPath: string;
  private className: string | undefined;
  private arguments: any[] = [];

  constructor(classPath: string) {
    this.classPath = classPath;
  }

  getClass(alias: string): any {
    const module = require(this.classPath);
    const className = this.className;
    let instantiableClasses = Object.values(module).filter(
      (value) => isEs5Class(value) || isClass(value)
    ) as (() => void)[];
    if (className) {
      instantiableClasses = instantiableClasses.filter(
        (instantiableClass) => instantiableClass.name === className
      );
    }

    if (!instantiableClasses.length) {
      throw new NoClassDeclared(alias);
    }

    return instantiableClasses[0];
  }

  addArgument(argument: any): Definition {
    this.arguments = [...this.arguments, argument];
    return this;
  }

  defineClass(className: string): Definition {
    this.className = className;
    return this;
  }

  getArguments(): any[] {
    return this.arguments;
  }
}
