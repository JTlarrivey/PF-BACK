import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { CategoriesModule } from 'src/categories/categories.module'; 
import { AuthModule } from 'src/auth/auth.module';
import { ReviewsModule } from 'src/reviews/reviews.module'; 
import { WebhookModule } from 'src/webhook/webhook.module';
import { DonationModule } from 'src/mercado-pago/donation.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from 'src/Admincharjs/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    BooksModule,
    FileUploadModule,
    CategoriesModule,
    AuthModule,
    ReviewsModule,
    DonationModule,
    WebhookModule,
    AdminModule,
    
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
