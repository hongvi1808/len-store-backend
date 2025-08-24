import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepo } from './product.repo';
import { FirebaseModule } from 'src/common/firebase/firebase.module';

@Module({
  imports:[FirebaseModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo],
})
export class ProductModule {}
