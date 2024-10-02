import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy'; // Asegúrate de importar la estrategia
import { PassportModule } from '@nestjs/passport';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), // Asegúrate de configurar el defaultStrategy
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, GoogleStrategy, JwtStrategy,MailService], // Registra JwtStrategy
})
export class AuthModule {}
