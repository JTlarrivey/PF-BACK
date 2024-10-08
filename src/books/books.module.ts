import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileUploadRepository } from 'src/file-upload/file.upload.repository';

@Module({
  imports: [PrismaModule, HttpModule, ],
  controllers: [BooksController],
  providers: [BooksService, FileUploadService, FileUploadRepository],
})
export class BooksModule {}
