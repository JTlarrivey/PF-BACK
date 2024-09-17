import { Module } from '@nestjs/common';
import { BookListsController } from './book-lists.controller';
import { BookListsService } from './book-lists.service';

@Module({
  controllers: [BookListsController],
  providers: [BookListsService]
})
export class BookListsModule {}
