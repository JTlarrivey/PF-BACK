import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { DonationModule } from 'src/mercado-pago/donation.module';


@Module({
  imports: [
    forwardRef(() => DonationModule),
  
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
