import { Provider } from './providerInterface';

export class Baz implements Provider {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
