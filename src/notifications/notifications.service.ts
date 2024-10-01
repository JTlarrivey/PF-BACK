import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './create-notification.dto';
import { UpdateNotificationDto } from './update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        user_id: createNotificationDto.user_id, // Asigna el usuario que recibe la notificación
        content: createNotificationDto.content,
        send_date: new Date(), // Establece la fecha de envío
      },
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      where: { isDeleted: false },
    });
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        notification_id: id,
        isDeleted: false,
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { notification_id: id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.prisma.notification.update({
      where: { notification_id: id },
      data: {
        ...(updateNotificationDto.content && { content: updateNotificationDto.content }),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.notification.update({
      where: { notification_id: id },
      data: { isDeleted: true },
    });
  }
}
