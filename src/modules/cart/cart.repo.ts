import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { uuidv7 } from 'uuidv7';
import { SessionUserModel } from '../../common/models/session-user.model';
import { FilterParams } from '../../common/models/filter-params.model';
import { forceToInfoPagition } from '../../common/utils/func';
import { PaginationItemModel } from '../../common/models/res-success.model';
import { CartItemRes } from './entities/cart.entity';

const defaultSelect = {
  id: true, classify: true,
  product: {
    select: {
      id: true, slug: true, name: true, price: true, images: true, stock: true,
    }
  },
  quantity: true
}

@Injectable()
export class CartItemRepo {
  constructor(private readonly db: PrismaService) { }
  async create(user: SessionUserModel, body: CreateCartDto) {
    const data: Prisma.CartItemUncheckedCreateInput = {
      id: uuidv7(),
      productId: body.productId,
      customerId: user.userId,
      quantity: body.quantity,
      createdAt: new Date().getTime(),
      createdBy: user.username,
      updatedAt: new Date().getTime(),
      updatedBy: user.username

    }
    const res = await this.db.cartItem.create({
      data,
      select: defaultSelect
    })
    return res
  }
  async createMany(user: SessionUserModel, body: CreateCartDto[]) {
    const data: Prisma.CartItemUncheckedCreateInput[] = body.map(i => ({
      id: uuidv7(),
      productId: i.productId,
      customerId: user.userId,
      quantity: i.quantity,
      createdAt: new Date().getTime(),
      createdBy: user.username,
      updatedAt: new Date().getTime(),
      updatedBy: user.username

    })) 
    const res = await this.db.cartItem.createMany({
      data,
    })
    return res
  }


  async findListByCustomer(customerId: string, filters: FilterParams): Promise<PaginationItemModel<CartItemRes | null>> {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.CartItemWhereInput = { alive: true, customerId  }
    const items = await this.db.cartItem.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: defaultSelect
    })
    const total = await this.db.cartItem.count({ where: whereOpt })
    return new PaginationItemModel(items, total, page, take)
  }
  async getCountByCustomer(customerId: string, ): Promise<number> {
    const whereOpt: Prisma.CartItemWhereInput = { alive: true, customerId  }
    const total = await this.db.cartItem.count({ where: whereOpt })
    return total
  }

  async findOne(id: string): Promise<CartItemRes | null> {
    const item = await this.db.cartItem.findUnique({
      where: { id },
      select: defaultSelect
    })
    if (item) {
      return item
    }
    return null
  }
  async findOneByProduct(id: string): Promise<CartItemRes | null> {
    const item = await this.db.cartItem.findFirst({
      where: { productId: id },
      select: defaultSelect
    })
    if (item) {
      return item
    }
    return null
  }

  async update(id: string, user: SessionUserModel, body: UpdateCartDto) {
    if (body.quantity === 0) return this.remove(id, user)
    const data: Prisma.CartItemUncheckedUpdateInput = {
      classify: body.classify || undefined,
      quantity: body.quantity || undefined,
      updatedAt: new Date().getTime(),
      updatedBy: user.username
    }
    const res = await this.db.cartItem.update({ where: { id }, data, select: defaultSelect })
    return res;
  }

  async remove(id: string, user: SessionUserModel,) {
    const data: Prisma.CartItemUncheckedUpdateInput = {
      updatedAt: new Date().getTime(),
      updatedBy: user.username,
      alive: false
    }
    const res = await this.db.cartItem.update({ where: { id }, data, select: defaultSelect })
    return res;
  }
}
