import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BookRequestsRealtime } from './book-requests.realtime.js';
// import { initAdminBookRequestsPage, destroyAdminBookRequestsPage } from './book-client.js';

@Injectable()
export class BooksRequestsService {
  constructor(private prisma: PrismaService, private realtime: BookRequestsRealtime) { }

  async createBookRequest(userId: number, bookId: number) {
    const pendingRequest = await this.prisma.bookRequest.findFirst({
      where: {
        userId,
        bookId,
        status: 'PENDING',
      },
      select: { id: true },
    });

    if (pendingRequest) {
      return {
        success: false,
        message: "You already have a pending request for this book and can't request for it again until it is resolved.",
      };
    }
    const bookRequest = await this.prisma.bookRequest.create({
      data: {
        userId,
        bookId,
        status: 'PENDING',
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        book: { select: { id: true, name: true, status: true, cover: true, yearPublished: true } },
      },
    });
    if (!bookRequest) {
      return {
        success: false,
        message: 'Failed to create book request',
      }
    };
    this.realtime.notifyAdmins(bookRequest);

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


  async getAllBookRequests() {
    const requests = await this.prisma.bookRequest.findMany({
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        book: { select: { id: true, name: true, status: true, cover: true, yearPublished: true } },
      },
    });

    return {
      success: true,
      message: 'Book requests retrieved successfully',
      data: requests,
    }
  }

  async approveBookRequest(requestId: number, adminId: number) {
    const bookRequest = await this.prisma.bookRequest.findUnique({
      where: { id: requestId },
    });

    if (!bookRequest || bookRequest.status !== 'PENDING') {
      return {
        success: false,
        message: 'Book request has either been approved/rejected or does not exist',
      };
    }

    
    const updatedRequest = await this.prisma.bookRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvedByAdminId: adminId,
        approvedAt: new Date(),
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        book: { select: { id: true, name: true, status: true, cover: true, yearPublished: true } },
        approvedByAdmin: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
      },
    });
    if (!updatedRequest) {
      return {
        success: false,
        message: 'Failed to approve book request',
      }
    };

    this.realtime.approveRequestNotification(updatedRequest);

    this.realtime.notifyUser(updatedRequest.userId, {
      requestId: updatedRequest.id,
      status: updatedRequest.status,
      bookTitle: updatedRequest.book.name,
      approvedByAdmin: updatedRequest.approvedByAdmin
        ? {
          id: updatedRequest.approvedByAdmin.id,
          firstName: updatedRequest.approvedByAdmin.firstName,
          lastName: updatedRequest.approvedByAdmin.lastName,
        }
        : null,
      approvedAt: updatedRequest.approvedAt,
    });

    return {
      success: true,
      message: 'Book request approved successfully',
      data: updatedRequest,
    };
  }

  async rejectBookRequest(requestId: number, adminId: number) {
    const bookRequest = await this.prisma.bookRequest.findUnique({
      where: { id: requestId },
    });

    if (!bookRequest || bookRequest.status !== 'PENDING') {
      return {
        success: false,
        message: 'Book request has either been approved/rejected or does not exist',
      };
    }
    const updatedRequest = await this.prisma.bookRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        approvedByAdminId: adminId,
        approvedAt: new Date(),
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        book: { select: { id: true, name: true, status: true, cover: true, yearPublished: true } },
        approvedByAdmin: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
      },
    });
    if (!updatedRequest) {
      return {
        success: false,
        message: 'Failed to reject book request',
      }
    };

    this.realtime.rejectRequestNotification(updatedRequest);

    this.realtime.notifyUser(updatedRequest.userId, {
      requestId: updatedRequest.id,
      status: updatedRequest.status,
      bookTitle: updatedRequest.book.name,
      approvedByAdmin: updatedRequest.approvedByAdmin
        ? {
          id: updatedRequest.approvedByAdmin.id,
          firstName: updatedRequest.approvedByAdmin.firstName,
          lastName: updatedRequest.approvedByAdmin.lastName,
        }
        : null,
      approvedAt: updatedRequest.approvedAt,
    });
    return {
      success: true,
      message: 'Book request rejected successfully',
      data: updatedRequest,
    };
  }

  // async refreshBookRequestPage() {
  //   initAdminBookRequestsPage();
  //   return
  // }

  // async closeBookRequestPage() {
  //   destroyAdminBookRequestsPage();
  //   return
  // }
}