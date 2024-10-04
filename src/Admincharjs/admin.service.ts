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

    const donaciones = await Promise.all(
      labels.map(async (date) => {
        return this.prisma.donation.count({
          where: {
            createdAt: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
          },
        });
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

    // Obtén los últimos 10 usuarios registrados
    const ultimosUsuarios = await this.prisma.user.findMany({
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
      donaciones,
      libros,
      usuarios,
      ultimosUsuarios, // Añade los últimos usuarios al resultado
    };
  }
}
