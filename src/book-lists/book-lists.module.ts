import { Module } from '@nestjs/common';
import { BookListsService } from './book-lists.service';
import { BookListsController } from './book-lists.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BookListsController], // Agrega el controlador
  providers: [BookListsService, PrismaService], // Agrega el servicio y PrismaService
})
export class BookListsModule {}
