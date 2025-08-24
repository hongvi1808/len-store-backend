import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { CustomExceptionFilter } from "src/configs/filters/custom-exception.filter";

@Injectable()
export class RedisService {
    
    constructor(@InjectRedis() private readonly redisClient: Redis) { }

    async get(key: string): Promise<string | null> {
        try {
            const result = await this.redisClient.get(key)
            return result;
        } catch (error) {
            throw new CustomExceptionFilter('REDIS_ERROR_GET', 'Loi tu get key redis', error);
        }
    }
    async set(key: string, value: string | number): Promise<void> {
        try {
            await this.redisClient.set(key, value);
        } catch (error) {
            throw new CustomExceptionFilter('REDIS_ERROR_SET', 'Loi tu set key redis', error);
        }
    }
}