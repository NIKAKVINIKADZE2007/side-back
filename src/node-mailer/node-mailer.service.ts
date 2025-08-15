import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeMailerService {
  constructor(private emailService: MailerService) {}
  async sendEmailText(to, subject, text) {
    const options = {
      to,
      subject,
      text,
    };

    await this.emailService.sendMail(options);
    return { message: 'email sent succseffully' };
  }
}
