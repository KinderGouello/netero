export class Definition {
  private classPath: string;
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

  getArguments(): any[] {
    return this.arguments;
  }
}
