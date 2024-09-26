import { Module } from '@nestjs/common';
import { DonationsService } from './donation.service';
import { DonationController } from './donation.controller';

@Module({
  providers: [DonationsService],
  controllers: [DonationController],
})
export class DonationModule {}
