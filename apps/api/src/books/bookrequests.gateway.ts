import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BookRequestsRealtime } from './book-requests.realtime.js';
import { Server, Socket } from 'socket.io';
import { BooksRequestsService } from './booksrequests.service.js';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'book-requests',
})
export class BookRequestsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(
    private readonly bookRequestsService: BooksRequestsService,
    private readonly realtime: BookRequestsRealtime,
    private readonly jwtService: JwtService,
  ) { }
  @WebSocketServer()
  server: Server;
  afterInit(server: Server) {
    server.use(async (socket, next) => {
      try {
        // console.log(socket.handshake.headers)
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) return next(new UnauthorizedException('No token or invalid token provided'));

        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });

        socket.data.userId = payload.sub;
        socket.data.role = payload.role;
        socket.data.firstName = payload.firstName;
        socket.data.lastName = payload.lastName;

        return next();
      } catch {
        return next(new UnauthorizedException('Invalid token'));
      }
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  onModuleInit() {
    this.realtime.setServer(this.server);
  }

  // Consider obtaining the ID from the request payload - sub.
  @SubscribeMessage('join-user')
  handleJoinUser(
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data?.userId;
    if (!userId) {
      client.emit('error', 'Unauthorized');
      return;
    }
    client.join(`user-${userId}`);
    client.emit('joined-user-room', userId);
    this.server.to(`user-${userId}`).emit('joined-user-room', userId);
  }

  @SubscribeMessage('join-admin') // Get messages from the client. 
  handleAdminJoin(@ConnectedSocket() client: Socket) { // Can consume actual body sent using the @MessageBody()
    // console.log("Client Data: ", client.data)
    const userRole = client.data?.role;
    if (userRole !== 'ADMIN') {
      client.emit('error', 'Unauthorized');
      return;
    }
    client.join('admins');
    const adminInfo = {
      id: client.data.userId,
      firstName: client.data.firstName,
      lastName: client.data.lastName,
    };
    // client.emit('joined-admin-room', adminInfo);
    this.server.to('admins').emit('joined-admin-room', adminInfo);
  }

  @SubscribeMessage("get-book-requests")
  async handleGetBookRequests(@ConnectedSocket() client: Socket) {
    if (!client) return;
    if (client.data == null || client.data?.role !== 'ADMIN') {
      client.emit('error', 'Unauthorized');
      return;
    }
    const result = await this.bookRequestsService.getAllBookRequests();
    client.emit('book-requests', result);
  }

}