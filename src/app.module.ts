import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerMiddleware } from './configs/middlewares/logger.middleware';
import { AuthMiddleware } from './configs/middlewares/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenAuthGuard } from './configs/guards/access-token-auth.guard';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './common/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { MailConsumerModule } from './consumer/mail/mail.module';
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RabbitModule } from './common/rabbitmq/rabbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(5678),
        NODE_ENV: Joi.string().valid('local', 'test', 'production').default('local'),
        GLOBAL_API_PREFIX: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
      })
    }),
    AuthModule,
    CacheModule.register({
      isGlobal: true
    }),
    PrismaModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    RabbitModule,
    UserModule,
    PermissionModule,
    
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AccessTokenAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes('')
  }
}
