import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BookRequestsRealtime } from './book-requests.realtime.js';
import { Server, Socket } from 'socket.io';
import { BooksRequestsService } from './booksrequests.service.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'book-requests',
})
export class BookRequestsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(private readonly bookRequestsService: BooksRequestsService, private readonly realtime: BookRequestsRealtime) { }
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log("Connected!")
    })

    this.realtime.setServer(this.server);
  }

  // Consider obtaining the ID from the request payload - sub.
  @SubscribeMessage('join-user')
  handleJoinUser(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Joining user: user-${userId}`);
    client.join(`user-${userId}`);
    client.emit('joined-user-room', userId);
  }

  @SubscribeMessage('join-admin') // Get messages from the client. 
  handleAdminJoin(@ConnectedSocket() client: Socket) { // Can consume actual body sent using the @MessageBody()
    // onMessage(@MessageBody() body: any)
    client.join('admins');
    client.emit('joined-admin-room');
    console.log('[WS] joined admins room:', client.id);
  }

  @SubscribeMessage("get-book-requests")
  async handleGetBookRequests(@ConnectedSocket() client: Socket) {

    if (!client) return;
    console.log('[WS] get-book-requests from client:', client);
    if (client.data == null || client.data?.role !== 'ADMIN') {
      client.emit('error', 'Forbidden');
      return;
    }


    const result = await this.bookRequestsService.getAllBookRequests();
    client.emit('book-requests', result);
  }

}