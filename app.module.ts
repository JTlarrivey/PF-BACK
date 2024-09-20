import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { CategoriesModule } from 'src/categories/categories.module'; // Corrige aquí
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    BooksModule,
    FileUploadModule,
    CategoriesModule,
    AuthModule, // Asegúrate de que CategoriesModule esté correctamente importado
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
