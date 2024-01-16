import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}
  @WebSocketServer() server: Server;
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: Prisma.ChatCreateInput,
  ): Promise<void> {
    await this.appService.createMessage(payload);
    this.server.emit('receiveMessage', payload);
  }
  afterInit(server: any) {
    console.log(server);
  }
  handleConnection(client: Socket) {
    console.log('connected', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('disconnected', client.id);
  }
}
