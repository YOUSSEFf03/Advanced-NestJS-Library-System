import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  constructor() {
    console.log('WebSocket Gateway initialized');
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('bookBorrowed')
  handleBookBorrowed(@MessageBody() data: any): void {
    this.server.emit('bookBorrowed', data);
  }

  @SubscribeMessage('bookReturned')
  handleBookReturned(@MessageBody() data: any): void {
    this.server.emit('bookReturned', data);
  }
}