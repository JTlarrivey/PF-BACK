import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Asegúrate de importar el servicio de Prisma
import { JwtModule } from '@nestjs/jwt'; // Importa el módulo JWT
import { ConfigModule } from '@nestjs/config'; // Importa ConfigModule si lo estás usando para manejar variables de entorno

@Module({
  imports: [
    ConfigModule, // Asegúrate de importar ConfigModule si lo necesitas
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Reemplaza esto con tu clave secreta
      signOptions: { expiresIn: '1h' }, // Establece la duración del token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService], // Asegúrate de que PrismaService esté incluido
})
export class AuthModule {}
