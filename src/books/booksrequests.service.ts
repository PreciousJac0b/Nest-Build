import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BookRequestsGateway } from './bookrequests.gateway.js';

@Injectable()
export class BooksRequestsService {
  constructor(private prisma: PrismaService, private bookRequestsGateway: BookRequestsGateway) { }

  async createBookRequest(userId: number, bookId: number) {
    const bookRequest = await this.prisma.bookRequest.create({
      data: {
        userId,
        bookId,
        status: 'PENDING',
      },
      include: {
        user: true,
        book: true,
      },
    });
    if (!bookRequest) {
      return {
        success: false,
        message: 'Failed to create book request',
      }
    };
    this.bookRequestsGateway.notifyAdmins(bookRequest);

    // Create payload for user notification
    const userPayload = {
      requestId: bookRequest.id,
      status: bookRequest.status,
      bookTitle: bookRequest.book.name,
    };
    await this.prisma.notification.create({
      data: {
        userId,
        type: 'BOOK_REQUEST_UPDATE',
        payload: userPayload,
      },
    });

    return {
      success: true,
      message: 'Book request created successfully',
      data: bookRequest,
    };

  }
}