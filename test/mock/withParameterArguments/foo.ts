export class Foo {
  private firstName: string;
  private surname: string;

  constructor(firstName: string, surname: string) {
    this.firstName = firstName;
    this.surname = surname;
  }

  getNames() {
    return {
      firstName: this.firstName,
      surname: this.surname,
    };
  }
}
