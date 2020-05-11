export class Bar {
  private number: number;
  private name: string;
  private name2: string;

  constructor(number: number, name: string, name2: string) {
    this.number = number;
    this.name = name;
    this.name2 = name2;
  }

  getValues() {
    return {
      number: this.number,
      name: this.name,
      name2: this.name2,
    };
  }
}
