import { Injectable } from '@nestjs/common';
import mercadopago from 'mercadopago';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { PreferenceCreateResponse } from 'mercadopago/resources/preferences';

@Injectable()
export class DonationsService {
  constructor() {
    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });
  }

  async createDonation(amount: number, description: string, payerEmail: string) {
    // Asegúrate de que el amount sea un número válido
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error("El amount debe ser un número válido mayor que cero.");
    }

    const orderData: CreatePreferencePayload = {
      items: [
        {
          title: description,
          unit_price: parseFloat(amount.toFixed(2)), // Asegúrate de que sea un número decimal válido
          quantity: 1,
          currency_id: "ARS", // Asegúrate de que este valor sea el correcto
        },
      ],
      back_urls: {
        success: "http://localhost/donation/succes",
        failure: "http://localhost:3000/donations/failure",
        pending: "http://localhost:3000/donations/pending",
      },
      notification_url: "https://2ba1-186-39-111-59.ngrok-free.app/webhook",
      payer: {
        email: payerEmail,
      },
    };

    try {
      const result: PreferenceCreateResponse = await mercadopago.preferences.create(orderData);
      return result; // Retorna la respuesta de la preferencia creada
    } catch (error) {
      console.error('Error creating donation:', error);
      throw new Error(`Donation creation failed: ${error.message}`);
    }

  }

  async handleWebhook(query: any) {
    console.log('Webhook received:', query);
    
    // Ejemplo de procesamiento de notificaciones
    if (query.type === 'payment') {
      const paymentId = query['data.id']; // ID del pago
      const paymentStatus = query['data.status']; // Estado del pago
      
      // Lógica para actualizar el estado de la donación en la base de datos
      // Aquí puedes llamar a tu servicio o repositorio para hacer la actualización
      console.log(`Payment ID: ${paymentId}, Payment Status: ${paymentStatus}`);
      
      // Implementar la lógica para guardar o actualizar el estado de la donación en tu base de datos
    }
  }

}
