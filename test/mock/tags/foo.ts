import { Provider } from './providerInterface';

export class Foo {
  private providers: Provider[];

  constructor(providers: Provider[]) {
    this.providers = providers;
  }

  getProviders(): Provider[] {
    return this.providers;
  }
}
