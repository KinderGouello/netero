import { Bar } from './bar';

export class Foo {
  private name: string;
  private bar: Bar;

  constructor(name: string, bar: Bar) {
    this.name = name;
    this.bar = bar;
  }

  getValues() {
    return {
      name: this.name,
      bar: this.bar,
    };
  }
}
