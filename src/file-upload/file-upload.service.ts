import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from "./file.upload.repository"
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly prisma: PrismaService,
  ) {}

  async uploadImage(file: Express.Multer.File, userId: string) {
    // Convertir userId a número
    const userIdNumber = parseInt(userId, 10);

    // Verificar si existe el usuario
    const user = await this.prisma.user.findUnique({
      where: { user_id: userIdNumber }, // Cambiado de id a user_id
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Subir imagen a Cloudinary
    const response = await this.fileUploadRepository.uploadImage(file);

    // Actualizar imagen del usuario
    await this.prisma.user.update({
      where: { user_id: userIdNumber }, // Cambiado de id a user_id
      data: { photoUrl: response.secure_url }, // Asegúrate de que photoUrl exista en el modelo
    });

    // Retornar usuario actualizado
    const updatedUser = await this.prisma.user.findUnique({
      where: { user_id: userIdNumber }, // Cambiado de id a user_id
    });
    return updatedUser;
  }
}
