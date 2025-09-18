import { Injectable } from '@nestjs/common';
import { CustomerCreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SessionUserModel } from '../../common/models/session-user.model';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
import { uuidv4, uuidv7 } from 'uuidv7';
import { forceToInfoPagition, generateOrderCode } from '../../common/utils/func';
import { FilterParams } from '../../common/models/filter-params.model';
import { PaginationItemModel } from '../../common/models/res-success.model';
import { OrderCreate } from './entities/order.entity';

const defaultSelect = { id: true, customerId: true, code: true, createdAt: true, totalPrice: true, status: true }
@Injectable()
export class OrderRepo {
  constructor(private readonly db: PrismaService) { }
  async create(body: OrderCreate, user?: SessionUserModel) {
    const orderNumber = await this.getOrderNumber();
    const data: Prisma.OrderUncheckedCreateInput = {
      id: uuidv7(),
      code: generateOrderCode(orderNumber),
      totalPrice: body.totalPrice,
      customerId: body.customerId || undefined,
      createdAt: new Date().getTime(),
      createdBy: user?.username || body.customerId || body.customerInfo?.phoneNumber || '',
      updatedAt: new Date().getTime(),
      updatedBy: user?.username || body.customerId || body.customerInfo?.phoneNumber || '',
      note: body.note,
      customerInfo: body.customerInfo,
      orderNumber,
    }
    const res = await this.db.order.create({
      data, select: defaultSelect
    })
    await this.db.orderItem.createMany({
      data: body.products.map((product): Prisma.OrderItemCreateManyInput => ({
        id: uuidv7(),
        orderId: res.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        createdAt: new Date().getTime(),
        createdBy: user?.username || body.customerId || body.customerInfo?.phoneNumber || '',
        updatedAt: new Date().getTime(),
        updatedBy: user?.username || body.customerId || body.customerInfo?.phoneNumber || ''
      }))
    })
    return res;
  }

  async findOrderItemsByOrder(orderId: string) {
    const whereOpt: Prisma.OrderItemWhereInput = { orderId, active: true }
    const items = await this.db.orderItem.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, price: true, orderId: true, name: true, quantity: true, productId: true, classify: true, product: {select: {images: true}}  }
    })
    const total = await this.db.orderItem.count({ where: whereOpt })
    return new PaginationItemModel(items, total, 1, 0)
  }
  async findList(filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.OrderWhereInput = { active: true }
    const items = await this.db.order.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select:{...defaultSelect, customerInfo: true}
    })
    const total = await this.db.order.count({ where: whereOpt })
    return new PaginationItemModel(items, total, page, take)
  }
  async findListByCustomer(user: SessionUserModel,filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.OrderWhereInput = { active: true, customerId: user.userId }
    const items = await this.db.order.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: {...defaultSelect, orderItems: {
        select: {id: true, name: true, quantity: true, price: true, classify: true, product: {select: {images: true}} }
      }}
    })
    const total = await this.db.order.count({ where: whereOpt })
    return new PaginationItemModel(items, total, page, take)
  }

  async findOne(id: string) {
    const item = await this.db.order.findUnique({
      where: { id },
      select: {...defaultSelect, orderItems: {
        select: {id: true, name: true, quantity: true, price: true, classify: true, product: {select: {images: true}}  }
      }}
    })
    return item
  }

  async updateStatus(id: string, user: SessionUserModel, status: OrderStatus) {
    const item = await this.db.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date().getTime(),
        updatedBy: user.username
      },
      select: defaultSelect

    })
    return item
  }
  async update(id: string, user: SessionUserModel, data: UpdateOrderDto) {
    const item = await this.db.order.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date().getTime(),
        updatedBy: user.username
      },
      select: defaultSelect

    })
    return item
  }

  async getOrderNumber() {
    const find = await this.db.order.findFirst({
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true }
    })
    if (!find) return 1
    return find.orderNumber + 1
  }
}
