import { RedisModule } from "@nestjs-modules/ioredis";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";

@Module({
   imports: [
    RedisModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService], 
        useFactory: (configService) => ({
            type: 'single',
            url: configService.get('REDIS_URL')
        })
    })
   ],
   providers: [RedisService],
   exports: [RedisService]
})
export class LenRedisModule {}