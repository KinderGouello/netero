export class Service {
  private instance: Function;

  constructor(instance: Function) {
    this.instance = instance;
  }

  getInstance(): Function {
    return this.instance;
  }
}
