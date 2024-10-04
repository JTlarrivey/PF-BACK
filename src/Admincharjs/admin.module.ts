import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module'; // Ajusta la ruta según tu estructura

@Module({
  imports: [PrismaModule], // Asegúrate de importar el PrismaModule
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
