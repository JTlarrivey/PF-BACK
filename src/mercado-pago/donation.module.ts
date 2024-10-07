import { Module, forwardRef } from '@nestjs/common';
import { DonationsService } from './donation.service';
import { DonationController } from './donation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [PrismaModule, forwardRef(() => MailModule)], // Usa forwardRef aquí
  providers: [DonationsService],
  controllers: [DonationController],
  exports: [DonationsService], // Asegúrate de exportar el servicio si se usa en otros módulos
})
export class DonationModule {}
