export class Definition {
  private classPath: string;
  private className: string | undefined;
  private arguments: any[] = [];

  constructor(classPath: string) {
    this.classPath = classPath;
  }

  getClass(): string {
    return this.classPath;
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

  getClassName(): string | undefined {
    return this.className;
  }
}
