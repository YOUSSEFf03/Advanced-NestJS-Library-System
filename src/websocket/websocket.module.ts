import { Module } from '@nestjs/common';
import { EventsGateway } from '../utils/events.gateway'; // Correct path to events.gateway.ts

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // Export EventsGateway if needed
})
export class WebsocketModule {}