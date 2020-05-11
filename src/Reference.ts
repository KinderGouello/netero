export class Reference {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  toString() {
    return this.id;
  }
}
