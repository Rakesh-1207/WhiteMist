import { NewsletterRepository } from '../repositories/newsletterRepository.js';

export class NewsletterService {
  static async subscribe(email) {
    return NewsletterRepository.subscribe(email);
  }

  static async unsubscribe(email) {
    return NewsletterRepository.unsubscribe(email);
  }

  static async getSubscribers() {
    return NewsletterRepository.findAll();
  }
}
