import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class BookRequestsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-admin')
  handleAdminJoin(@ConnectedSocket() client: Socket) {
    client.join('admins');
    client.emit('joined-admin-room');
  }

  notifyAdmins(bookRequest: any) {
    this.server.emit('new-book-request', bookRequest);
  }

  notifyUser(userId: number, payload: any) {
    this.server.to(`user-${userId}`).emit('book-request-update', payload);
  }
}