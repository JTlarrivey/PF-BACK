import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { DonationsService } from './donation.service';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtendedRequest } from 'src/interface/extended-request.interface';
import { MailService } from 'src/mail/mail.service';

@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationsService,
    private readonly mailService: MailService,
  ) {}

  // Endpoint para crear una orden de donación
  @UseGuards(AuthGuard('jwt')) // Asegúrate de usar el guardia de autenticación
  @Post('create-order')
  async createOrder(
    @Body() createDonationDto: { amount: number; description: string; payerEmail: string },
    @Req() req: ExtendedRequest, // Usa la interfaz ExtendedRequest aquí
    @Res() res: Response
  ) {
    try {
      const userId = req.user?.user_id; // Accede a id de forma segura

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing' });
      }

      // Llamamos al servicio con los parámetros correctos, incluyendo userId
      const order = await this.donationService.createDonation(
        createDonationDto.amount,
        createDonationDto.description,
        createDonationDto.payerEmail,
        userId // Aquí pasamos el userId
      );

      res.json(order); // Retorna la respuesta de MercadoPago o algún resultado
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Endpoint para el webhook
  @Post('webhook')
async receiveWebhook(@Body() body: any, @Res() res: Response) {
  try {
    console.log('Webhook received:', body);

    // Maneja el webhook con el servicio de donaciones
    await this.donationService.handleWebhook(body);

    // Verificamos el tipo de evento y estado del pago
    if (body.type === 'payment' && body.action === 'payment.created') {
      const paymentId = body.data.id; // ID del pago

      // Obtener los detalles del pago usando el nuevo método en el servicio
      const paymentResponse = await this.donationService.getPaymentDetails(paymentId);
      const paymentData = paymentResponse.body;

      const status = paymentData.status;
      const email = paymentData.payer.email;

      // Si el pago es aprobado, enviamos el correo
      if (status === 'approved') {
        await this.mailService.sendThankYouEmail(email);
      }
    }

    return res.sendStatus(204); // HTTP 204 sin contenido
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ message: 'Webhook handling error', error: error.message });
  }
}


  // Endpoint para la página de éxito (opcional)
  @Get('success')
  getSuccess(@Res() res: Response) {
    res.send('Success');
  }

  // Endpoint para obtener las donaciones del usuario autenticado
  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async getUserDonations(@Req() req: ExtendedRequest, @Res() res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
  
    const userId = req.user.user_id; // Cambia 'user_id' a 'id'
    try {
      const donations = await this.donationService.getUserDonations(userId);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching donations', error: error.message });
    }
  }
}
