export class Definition {
  private classe: string;
  private arguments: any[] = [];

  constructor(classe: string) {
    this.classe = classe;
  }

  getClass(): string {
    return this.classe;
  }

  addArgument(argument: any): Definition {
    this.arguments = [...this.arguments, argument];
    return this;
  }

  getArguments(): any[] {
    return this.arguments;
  }
}
