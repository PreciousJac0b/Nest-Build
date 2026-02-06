import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class BookRequestsRealtime {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  notifyAdmins(bookRequest: any) {
    console.log("Notifying admins of new book request: ", bookRequest);
    this.server?.to('admins').emit('new-book-request', bookRequest);
  }

  approveRequestNotification(bookRequest: any) {
    console.log("Book Request: ", bookRequest)
    this.server?.to('admins').emit('book-request-updated', bookRequest);
    console.log(`Emitting book-request-updated for request ${bookRequest.id} to admins room`);
  }

  rejectRequestNotification(bookRequest: any) {
    this.server?.to('admins').emit('book-request-updated', bookRequest);
  }

  notifyUser(userId: number, payload: any) {
    console.log(`Notifying user-${userId}:`, payload);
    this.server?.to(`user-${userId}`).emit('book-request-update', payload);
  }
}
