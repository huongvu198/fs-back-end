import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { IoAdapter } from '@nestjs/platform-socket.io';

@Module({
  controllers: [],
  exports: [SocketGateway],
  providers: [
    SocketGateway,
    {
      provide: 'SOCKET_IO_ADAPTER',
      useValue: new IoAdapter(),
    },
  ],
})
export class SocketsModule {}
