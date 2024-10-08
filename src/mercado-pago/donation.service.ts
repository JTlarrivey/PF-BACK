import { Injectable } from '@nestjs/common';
import mercadopago from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { PreferenceCreateResponse } from 'mercadopago/resources/preferences';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService,
    private readonly mailservice: MailService

  ) {
    // Configuración de MercadoPago
    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });
  }

  // Crear donación
  async createDonation(amount: number, description: string, payerEmail: string, userId: number) {
    // Validar que el amount sea un número positivo
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error("El amount debe ser un número válido mayor que cero.");
    }

    // Crear la donación en la base de datos
    const newDonation = await this.prisma.donation.create({
      data: {
        payerEmail: payerEmail,
        transactionAmount: amount,
        status: 'pending',
        eventDate: new Date(),
        eventType: 'create',
        rawWebhookData: {}, // Inicializa como objeto vacío si es Json
        preferenceId: null,
        user: {
          connect: { user_id: userId }, // Cambia `id` por `user_id`
        },
      },
    });
  
    // Crear la preferencia de pago con MercadoPago y usar el ID de la donación como external_reference
    const orderData: CreatePreferencePayload = {
      items: [
        {
          title: description,
          unit_price: parseFloat(amount.toFixed(2)),
          quantity: 1,
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "http://localhost:81/donations/success",
        failure: "http://localhost:3000/donations/failure",
        pending: "http://localhost:3000/donations/pending",
      },
      notification_url: "https://booknity-api.onrender.com/donations/webhook",
      payer: {
        email: payerEmail,
      },
      external_reference: newDonation.id, // Asigna el ID de la donación como external_reference
    };
  
    try {
      // Crear la preferencia en MercadoPago
      const result: PreferenceCreateResponse = await mercadopago.preferences.create(orderData);
  
      // Actualiza la donación con el ID de la preferencia
      await this.prisma.donation.update({
        where: { id: newDonation.id },
        data: { preferenceId: result.body.id }, // Almacena el preferenceId desde el resultado
      });
  
      return { donation: newDonation, mpLink: result.body.init_point };
    } catch (error) {
      console.error('Error creating donation:', error);
      throw new Error(`Donation creation failed: ${error.message}`);
    }
  }
  
  // Manejar webhook de MercadoPago
  async handleWebhook(body: any) {
    console.log('Webhook received:', body);
  
    // Verifica el tipo de acción
    if (body.type === 'payment' && body.action === 'payment.created') {
      const paymentId = body.data.id; // ID del pago
      console.log('Payment ID received:', paymentId);
  
      try {
        const paymentResponse = await mercadopago.payment.get(paymentId);
        const paymentAttributes = paymentResponse.body;
  
        console.log('Payment Attributes:', paymentAttributes);
  
        // Extrae el ID de la donación del payload
        const donationId = paymentAttributes.external_reference; // Esto debería ser el ID de la donación que recibiste al crearla.
        console.log('Donation ID to find:', donationId);
  
        // Busca la donación en la base de datos usando el ID obtenido de external_reference
        const donation = await this.prisma.donation.findUnique({
          where: { id: donationId }, // Busca por el ID de la donación
        });
  
        if (!donation) {
          throw new Error(`No donation found for id: ${donationId}`);
        }
  
        // Actualiza la donación con los detalles del pago
        await this.prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: paymentAttributes.status, // Actualiza el estado
            transactionAmount: paymentAttributes.transaction_amount, // Actualiza el monto
            paymentMethod: paymentAttributes.payment_method_id, // Método de pago
            eventType: 'payment.created', // Tipo de evento
            eventDate: new Date(paymentAttributes.date_created), // Fecha del evento
            rawWebhookData: JSON.stringify(body), // Guarda el payload completo para referencia
            // No se actualiza payerEmail para mantener el correo original
          },
        });
        await this.mailservice.sendThankYouEmail(donation.payerEmail);
  
        console.log(`Donation with Payment ID: ${paymentId} updated successfully.`);
      } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error(`Payment processing failed: ${error.message}`);
      }
    }
  }
  // Obtener donaciones del usuario
 // DonationsService
async getDonationById(donationId: string) {
  try {
    return await this.prisma.donation.findUnique({
      where: { id: donationId },
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    throw new Error(`Failed to fetch donation: ${error.message}`);
  }
}

  async getPaymentDetails(paymentId: number) {
    try {
      // Consultar detalles del pago en Mercado Pago
      return await mercadopago.payment.get(paymentId);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error(`Failed to fetch payment details: ${error.message}`);
    }
  }
}
