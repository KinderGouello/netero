import { Mailer } from '../service/Mailer';

export class NewsletterManager {
  private mailer: Mailer;

  constructor(mailer: Mailer) {
    this.mailer = mailer;
  }

  getMailer() {
    return this.mailer;
  }
}
