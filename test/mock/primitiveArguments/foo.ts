export class Foo {
  private firstName: string;
  private number: number;
  private array: Array<string>;

  constructor(firstName: string, number: number, array: Array<string>) {
    this.firstName = firstName;
    this.number = number;
    this.array = array;
  }

  getValues() {
    return {
      firstName: this.firstName,
      number: this.number,
      array: this.array,
    };
  }
}
