import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepo } from './product.repo';

@Module({
  imports:[],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo],
})
export class ProductModule {}
