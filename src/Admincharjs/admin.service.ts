import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }).reverse();

    // Sumar las donaciones por cada día
    const donaciones = await Promise.all(
      labels.map(async (date) => {
        const result = await this.prisma.donation.aggregate({
          _sum: {
            transactionAmount: true, // Aquí utilizamos 'transactionAmount'
          },
          where: {
            createdAt: {
              gte: new Date(`${date}T00:00:00.000Z`), // Desde el inicio del día
              lt: new Date(`${date}T23:59:59.999Z`),  // Hasta el final del día
            },
          },
        });
        return result._sum.transactionAmount || 0; // Devuelve la suma o 0 si no hay donaciones ese día
      }),
    );

    const libros = await Promise.all(
      labels.map(async (date) => {
        return this.prisma.book.count({
          where: {
            createdAt: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
          },
        });
      }),
    );

    const usuarios = await Promise.all(
      labels.map(async (date) => {
        return this.prisma.user.count({
          where: {
            registration_date: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
          },
        });
      }),
    );

    // Obtén los últimos 10 usuarios registrados que no sean administradores
    const ultimosUsuarios = await this.prisma.user.findMany({
      where: {
        isAdmin: false, // Solo usuarios que no son administradores
      },
      orderBy: {
        registration_date: 'desc',
      },
      take: 10, // Trae solo los últimos 10 usuarios
      select: {
        user_id: true,
        email: true,
        name: true,
        registration_date: true, // Asegúrate de traer la fecha de registro
      },
    });

    return {
      labels,
      dataset: [
        {
       
          data: donaciones,
        },
        {
         
          data: libros,
        },
        {
         
          data: usuarios,
        },
      ],
      ultimosUsuarios, // Añade los últimos usuarios al resultado
    };
  }
}
