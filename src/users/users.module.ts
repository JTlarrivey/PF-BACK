import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileUploadService } from './../file-upload/file-upload.service'; 
import { FileUploadRepository } from './../file-upload/file.upload.repository'; 

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService, FileUploadRepository], 
})
export class UsersModule {}
