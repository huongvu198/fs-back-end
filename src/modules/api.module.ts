import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SocketsModule } from './socket-gateway/socket.module';

@Module({
  imports: [HealthModule, AuthModule, RolesModule, UsersModule, SocketsModule],
  providers: [],
})
export class ApiModule {}
