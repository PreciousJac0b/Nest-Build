import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('MAIL_TRANSPORTER_SERVICE'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_USER'),
      to,
      subject,
      text,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}