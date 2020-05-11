export class Mailer {
  private transport: string;

  constructor(transport: string) {
    this.transport = transport;
  }

  getTransport() {
    return this.transport;
  }
}
