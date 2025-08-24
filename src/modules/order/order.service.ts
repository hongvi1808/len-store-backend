import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepo } from './order.repo';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';
import { PaginationItemModel } from 'src/common/models/res-success.model';
import { OrderItemsRes, OrderRes } from './entities/order.entity';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly orderRep: OrderRepo) { }
  async create(user: SessionUserModel, body: CreateOrderDto) {
    return this.orderRep.create(user, body)
  }

  async findList(filers: FilterParams): Promise<PaginationItemModel<OrderRes | null>> {
    return this.orderRep.findList(filers)
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

}
