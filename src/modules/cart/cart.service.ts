import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { CartItemRepo } from './cart.repo';
import { PaginationItemModel } from 'src/common/models/res-success.model';
import { CartItemRes } from './entities/cart.entity';
import { FilterParams } from 'src/common/models/filter-params.model';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepo: CartItemRepo){}
  async create(user: SessionUserModel, body: CreateCartDto) {
      return this.cartItemRepo.create(user, body)
    }
  
    async findList(filers: FilterParams): Promise<PaginationItemModel<CartItemRes | null>> {
      return this.cartItemRepo.findList(filers)
    }
  
    async findOne(id: string): Promise<CartItemRes | null> {
      return this.cartItemRepo.findOne(id)
    }
  
    update(id: string, user: SessionUserModel, body: UpdateCartDto) {
      return this.cartItemRepo.update(id, user, body)
    }
  
    remove(id: string, user: SessionUserModel) {
      return this.cartItemRepo.remove(id, user)
    }
}
