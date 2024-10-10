import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';

@Module({
  controllers: [PdfController],
})
export class PdfModule {}
