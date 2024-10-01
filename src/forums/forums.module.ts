import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ForumsController],
  providers: [ForumsService, PrismaService],
})
export class ForumsModule {}
