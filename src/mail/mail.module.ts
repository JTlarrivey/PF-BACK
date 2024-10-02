import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // Asegúrate de exportar el servicio para que esté disponible
})
export class MailModule {}
