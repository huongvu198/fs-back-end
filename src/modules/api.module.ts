import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WebhookMudule } from './webhooks/webhook.module';
import { SocketsModule } from './socket-gateway/socket.module';
import { ProductsModule } from './products/products.module';
import { MasterDataModule } from './master-data/master-data.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    RolesModule,
    UsersModule,
    WebhookMudule,
    SocketsModule,
    ProductsModule,
    MasterDataModule,
  ],
  providers: [],
})
export class ApiModule {}
