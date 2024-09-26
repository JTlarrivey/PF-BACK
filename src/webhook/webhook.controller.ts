import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('mercadopago')
  async handleMercadoPagoWebhook(@Body() body: any) {
    console.log('Webhook recibido:', body);

    // Llamamos al servicio para procesar la notificación
    return this.webhookService.processMercadoPagoNotification(body);
  }
}
