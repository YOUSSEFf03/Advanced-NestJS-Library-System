import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'], 
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('bookBorrowed')
  handleBookBorrowed(@MessageBody() data: any): void {
    console.log('Book borrowed:', data);
    this.server.emit('bookBorrowed', data);
  }

  @SubscribeMessage('bookReturned')
  handleBookReturned(@MessageBody() data: any): void {
    console.log('Book returned:', data);
    this.server.emit('bookReturned', data);
  }
}