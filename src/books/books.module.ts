import { Module } from '@nestjs/common';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { BooksRequestsService } from './booksrequests.service.js';
import { BookRequestsGateway } from './bookrequests.gateway.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { BookRequestsRealtime } from './book-requests.realtime.js';
import { BooksRequestController } from './booksrequest.controller.js';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [BooksController, BooksRequestController],
  providers: [BooksService, BooksRequestsService, BookRequestsGateway, BookRequestsRealtime],
  exports: [BooksService, BooksRequestsService],
})
export class BooksModule {}
