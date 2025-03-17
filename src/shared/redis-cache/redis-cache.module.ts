import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

import { config } from '../../config/app.config';
import { RedisCacheService } from './redis-cache.service';
import { isDeployEnv } from '../helpers/common.helper';

const { max, ttl, host, port } = config.redis;

@Module({
  exports: [RedisCacheService],
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          max: max,
          store: await redisStore({
            socket: {
              host: host,
              port: +port,
            },
          }),
          ttl: ttl,
        } as CacheModuleAsyncOptions;
      },
    }),
  ],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
