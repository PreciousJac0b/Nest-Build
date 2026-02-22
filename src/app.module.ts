import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';
// import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { AdminModule } from './admin/admin.module.js';
import { PaystackModule } from './paystack/paystack.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BooksModule,
    UsersModule,
    AuthModule,
    MailModule,
    PrismaModule,
    CloudinaryModule,
    AdminModule,
    // PaystackModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  // constructor(private configService: ConfigService) {
  //   console.log('[ENV CHECK]', {
  //     CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  //     CLOUDINARY_API_SECRET_SET: !!process.env.CLOUDINARY_API_SECRET,
  //   });

  //   console.log('[ENV CHECK ConfigService]', {
  //     CLOUDINARY_API_KEY: this.configService.get('CLOUDINARY_API_KEY'),
  //     CLOUDINARY_API_SECRET_SET: !!this.configService.get('CLOUDINARY_API_SECRET'),
  //   });
  // }
}
