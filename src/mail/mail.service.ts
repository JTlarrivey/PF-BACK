import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });
    }

    async sendThankYouEmail(email: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Gracias por tu colaboración',
            text: 'Muchas gracias por la colaboración a la comunidad de Booknity. Agradecemos tu ayuda.',
            html: '<p>Muchas gracias por la colaboración a la comunidad de <strong>Booknity</strong>. Agradecemos tu ayuda.</p>',
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Correo de agradecimiento enviado');
        } catch (error) {
            console.error('Error al enviar el correo de agradecimiento:', error);
            throw new BadRequestException('Error al enviar el correo de agradecimiento');
        }
    }
    async sendMail(to: string, subject: string, text: string, html: string) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to,
          subject,
          text,
          html,
        };
    
        try {
          await this.transporter.sendMail(mailOptions);
          console.log('Correo enviado');
        } catch (error) {
          console.error('Error al enviar el correo:', error);
          throw new BadRequestException('Error al enviar el correo');
        }
      }
    }
