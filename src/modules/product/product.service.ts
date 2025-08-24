import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepo } from './product.repo';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';
import { ProductRes } from './entities/product.entity';
import { PaginationItemModel } from 'src/common/models/res-success.model';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) { }
  async create(user: SessionUserModel, body: CreateProductDto) {
    return this.productRepo.create(user, body)
  }

  async findList(filers: FilterParams): Promise<PaginationItemModel<ProductRes | null>> {
    return this.productRepo.findList(filers)
  }

  async findOne(id: string): Promise<ProductRes | null> {
    return this.productRepo.findOne(id)
  }

  update(id: string, user: SessionUserModel, body: UpdateProductDto) {
    return this.productRepo.update(id, user, body)
  }

  remove(id: string, user: SessionUserModel) {
    return this.productRepo.remove(id, user)
  }
}
