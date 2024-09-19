import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FileUploadRepository } from './file.upload.repository'; // Asegúrate de que esta ruta sea correcta
import { PrismaService } from 'src/prisma/prisma.service'; // Asegúrate de que esta ruta sea correcta

@Module({
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    FileUploadRepository, // Asegúrate de incluir el repository
    PrismaService, // Asegúrate de incluir PrismaService
  ],
})
export class FileUploadModule {}
