import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  exports: [SocketGateway],
  imports: [ConfigModule, JwtModule],
  providers: [SocketGateway],
})
export class SocketsModule {}
