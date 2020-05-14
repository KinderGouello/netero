export class Service {
  private instance: () => void;

  constructor(instance: () => void) {
    this.instance = instance;
  }

  getInstance(): () => void {
    return this.instance;
  }
}
