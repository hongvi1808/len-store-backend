import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { SessionUserModel } from '../../common/models/session-user.model';
import { CartItemRepo } from './cart.repo';
import { PaginationItemModel } from '../../common/models/res-success.model';
import { CartItemRes } from './entities/cart.entity';
import { FilterParams } from '../../common/models/filter-params.model';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepo: CartItemRepo) { }
  async create(user: SessionUserModel, body: CreateCartDto) {
    const foundCart = await this.cartItemRepo.findOneByProduct(body.productId);
    if (foundCart) return  this.cartItemRepo.update(foundCart.id, user, { classify: body.classify, quantity: foundCart.quantity + body.quantity })
    return this.cartItemRepo.create(user, body)
  }
  async createMany(user: SessionUserModel, body: CreateCartDto[]) {
    return this.cartItemRepo.createMany(user, body)
  }

  async findListByCustomer(user: SessionUserModel, filers: FilterParams): Promise<PaginationItemModel<CartItemRes | null>> {
    return this.cartItemRepo.findListByCustomer(user.userId, filers)
  }
  async getCountByCustomer(customerId: string,): Promise<number> {
    return this.cartItemRepo.getCountByCustomer(customerId)
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
