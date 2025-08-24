import { Module } from '@nestjs/common';
import { CartItemService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItemRepo } from './cart.repo';

@Module({
  controllers: [CartController],
  providers: [CartItemService, CartItemRepo],
})
export class CartModule {}
