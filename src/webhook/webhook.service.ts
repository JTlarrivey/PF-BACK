import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  async processMercadoPagoNotification(notification: any) {
    const paymentId = notification.data.id;
    const eventType = notification.type;

    console.log(`Notificación recibida para el pago ID: ${paymentId}, evento: ${eventType}`);

    // Aquí puedes manejar la lógica de actualización del pago
    // Por ejemplo, cambiar el estado del pago en tu base de datos

    return { success: true };
  }
}
