import nodemailer from 'nodemailer';
import { env } from '../env';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // configure the email transport
      host: env.smtpHost,
      port: env.smtpPort,
      // secure: env.smtpSecure,
      // auth: {
      //   user: env.smtpUser, // replace with your email address
      //   pass: env.smtpPass, // replace with your email password
      // },
    });
  }

  public async sendEmail(email: string, subject: string, content: string) {
    try {
      await this.transporter.sendMail({
        from: 'WTW Claims Financial System <noreply-claims@wtwco.com>', // replace with your name and email address
        to: email,
        subject: subject,
        text: content,
      });
      console.log(`Approval notification email sent to ${email}`);
    } catch (err) {
      console.error(`Error sending approval notification email to ${email}:`, err);
    }
  }
}