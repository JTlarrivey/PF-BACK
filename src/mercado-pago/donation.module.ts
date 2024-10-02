import { Module } from '@nestjs/common';
import { DonationsService } from './donation.service';
import { DonationController } from './donation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [PrismaModule,MailModule], 
  providers: [DonationsService],
  controllers: [DonationController],
})
export class DonationModule {}
