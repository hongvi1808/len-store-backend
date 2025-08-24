import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepo } from './order.repo';
import { RabbitModule } from 'src/common/rabbitmq/rabbit.module';

@Module({
  imports: [RabbitModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepo],
})
export class OrderModule {}
