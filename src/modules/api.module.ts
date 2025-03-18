import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WebhookMudule } from './webhooks/webhook.module';

@Module({
  imports: [HealthModule, AuthModule, RolesModule, UsersModule, WebhookMudule],
  providers: [],
})
export class ApiModule {}
