import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { uuidv7 } from 'uuidv7';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';
import { forceToInfoPagition } from 'src/common/utils/func';
import { PaginationItemModel } from 'src/common/models/res-success.model';
import { CartItemRes } from './entities/cart.entity';

const defaultSelect = {
  id: true,
  product: {
    select: {
      id: true, slug: true, name: true, price: true
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
      customerId: body.customerId,
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


  async findList(filters: FilterParams): Promise<PaginationItemModel<CartItemRes | null>> {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.CartItemWhereInput = { quantity: { gt: 1 }, alive: true }
    const items = await this.db.cartItem.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: defaultSelect
    })
    const total = await this.db.cartItem.count({ where: whereOpt })
    const res: CartItemRes[] = items.map(i => ({
      id: i.id,
      productId: i.product.id,
      productName: i.product.name,
      productPrice: i.product.price,
      quantity: i.quantity,
      slug: i.product.slug
    }))
    return new PaginationItemModel(res, total, page, take)
  }

  async findOne(id: string): Promise<CartItemRes | null> {
    const item = await this.db.cartItem.findUnique({
      where: { id },
      select: defaultSelect
    })
    if (item) {
      const res: CartItemRes = {
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
        slug: item.product.slug
      }
      return res
    }
    return null
  }

  async update(id: string, user: SessionUserModel, body: UpdateCartDto) {
    if (body.quantity === 0) return this.remove(id, user)
    const data: Prisma.CartItemUncheckedUpdateInput = {
      productId: body.productId || undefined,
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
