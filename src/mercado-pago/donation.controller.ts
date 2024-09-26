import { Controller, Post, Body } from '@nestjs/common';
import { DonationsService } from './donation.service';

@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationsService) {}

  @Post()
  async createDonation(@Body() createDonationDto: { amount: number; description: string; email: string; token: string }) {
    const { amount, description, email, token } = createDonationDto;
    return await this.donationService.createDonation(amount, description, email, token);
  }
}
