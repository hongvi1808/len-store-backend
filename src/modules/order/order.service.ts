import { Injectable } from '@nestjs/common';
import { CustomerCreateOrderDto } from './dto/create-order.dto';
import { OrderRepo } from './order.repo';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';
import { PaginationItemModel } from 'src/common/models/res-success.model';
import { OrderCreate, OrderItemsRes, OrderRes } from './entities/order.entity';
import { OrderStatus, UserRole } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRep: OrderRepo) { }
  async customerOrder(body: CustomerCreateOrderDto) {
    // const userOrder: SessionUserModel = user?.sid ? user : {
    //   role: UserRole.Customer,
    //   sid: '',
    //   userId: '',
    //   username: body.phoneNumber || ''
    // }

    const data: OrderCreate = {
      customerId: body?.customerId || '',
      paymentMethod: body.paymentMethod,
      customerInfo:
      {
        name: body.name || '',
        phoneNumber: body.phoneNumber || '',
        email: body.email || '',
        address: body.address || ''
      },
      products: body.products,
      totalPrice: body.totalPrice
    }
    const result = await this.orderRep.create(data)
    return result
  }
  async create(user: SessionUserModel, body: CustomerCreateOrderDto) {
    const data: OrderCreate = {
      customerId: body.customerId,
      paymentMethod: body.paymentMethod,
      customerInfo:
      {
        name: body.name || '',
        phoneNumber: body.phoneNumber || '',
        email: body.email || '',
        address: body.address || ''
      },
      products: body.products,
      totalPrice: body.totalPrice
    }
    return this.orderRep.create( data, user)
  }

  async findList( filers: FilterParams): Promise<PaginationItemModel<any>> {
    return this.orderRep.findList(filers)
  }
  async findListByCustomer(user: SessionUserModel, filers: FilterParams): Promise<PaginationItemModel<OrderRes | null>> {
    return this.orderRep.findListByCustomer(user, filers)
  }
  async findOrderItemsByOrder(orderId: string): Promise<PaginationItemModel<OrderItemsRes | null>> {
    return this.orderRep.findOrderItemsByOrder(orderId)
  }

  async findOne(id: string): Promise<OrderRes | null> {
    return this.orderRep.findOne(id)
  }

  async updateStatus(id: string, user: SessionUserModel, status: OrderStatus) {
    return this.orderRep.updateStatus(id, user, status)
  }
  async update(id: string, user: SessionUserModel, data: UpdateOrderDto) {
    return this.orderRep.update(id, user, data)
  }

}
