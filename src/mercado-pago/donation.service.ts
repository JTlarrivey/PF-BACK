import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';

@Injectable()
export class DonationsService {
  constructor() {
    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });
  }

  async createDonation(amount: number, description: string, payerEmail: string, token: string) {
    const donationData = {
      transaction_amount: amount,
      description: description,
      payment_method_id: 'visa', // Cambia esto según el método de pago
      token: token, // Añadir el token aquí
      payer: {
        email: payerEmail,
        identification: {
          type: 'DNI',
          number: '12345678',
        },
      },
      installments: 1,
    };
  
    // Imprime el objeto donationData antes de enviarlo
    console.log('Datos de donación a enviar:', donationData);
  
    try {
      const donation = await mercadopago.payment.create(donationData);
      return donation;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw new Error(`Donation creation failed: ${error.message}`);
    }
  }
  
}
