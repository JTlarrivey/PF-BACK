import { DonationsService } from 'src/mercado-pago/donation.service';
import { MailService } from './mail.service'; // Asegúrate de importar MailService
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express'; // Importa Response desde express

@Controller('donations')
export class DonationController {
  constructor(
    private readonly donationService: DonationsService,
    private readonly mailService: MailService, // Inyecta MailService
  ) {}

  // Endpoint para el webhook
  @Post('webhook')
  async receiveWebhook(@Body() body: any, @Res() res: Response) {
    try {
      // Maneja el webhook
      await this.donationService.handleWebhook(body);
  
      const paymentStatus = body.data.attributes.status;
      const payerEmail = body.data.attributes.payer.email;
  
      // Solo envía el correo si el pago fue aprobado
      if (paymentStatus === 'approved') {
        await this.mailService.sendThankYouEmail(payerEmail);
      }
  
      return res.sendStatus(204); // HTTP 204 sin contenido
    } catch (error) {
      console.error('Error handling webhook:', error);
      return res.status(500).json({ message: 'Webhook handling error', error: error.message });
    }
  }
  
}