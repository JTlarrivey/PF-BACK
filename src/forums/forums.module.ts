import { Module } from '@nestjs/common';
import { ForumsController } from './forums.controller';
import { ForumsService } from './forums.service';

@Module({
  controllers: [ForumsController],
  providers: [ForumsService]
})
export class ForumsModule {}
