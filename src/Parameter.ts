export class Parameter {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  toString() {
    return this.id;
  }
}
