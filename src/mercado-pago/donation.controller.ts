import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { DonationsService } from './donation.service';
import { Response } from 'express';

@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationsService) {}

  // Endpoint para crear una orden de donación
  @Post('create-order')
  async createOrder(@Body() createDonationDto: { amount: number; description: string; payerEmail: string }, @Res() res: Response) {
    try {
      const order = await this.donationService.createDonation(createDonationDto.amount, createDonationDto.description, createDonationDto.payerEmail);
      res.json(order); // Enviamos la respuesta de MercadoPago
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Endpoint para el webhook
  @Post('webhook')
  async receiveWebhook(@Query() query: any, @Res() res: Response) {
    try {
      await this.donationService.handleWebhook(query);
      res.sendStatus(204); // HTTP 204 sin contenido
    } catch (error) {
      res.status(500).json({ message: 'Webhook handling error', error: error.message });
    }
  }

  // Endpoint para la página de éxito (opcional)
  @Get('success')
  getSuccess(@Res() res: Response) {
    res.send('Success');
  }
}
