import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CustomerCreateOrderDto } from './dto/create-order.dto';
import { SessionUser } from '../../configs/decorators/session-user.decorator';
import { SessionUserModel } from '../../common/models/session-user.model';
import { FilterParams } from '../../common/models/filter-params.model';
import { OrderStatus } from '@prisma/client';
import { RabbitService } from '../../common/rabbitmq/rabbit.service';
import { NoGlobalAuth } from '../../configs/decorators/no-auth.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
     private readonly mailClient: RabbitService) { }

  @NoGlobalAuth()
  @Post('/customer')
  async customerOrder(@SessionUser() user: SessionUserModel, @Body() createOrderDto: CustomerCreateOrderDto) {
    const order = await this.orderService.customerOrder(createOrderDto);
    if (order && createOrderDto.email) {
      this.mailClient.sendMailCreatedOrder(order);
    }
    return order;
  }
  @Post()
  async create(@SessionUser() user: SessionUserModel, @Body() createOrderDto: CustomerCreateOrderDto) {
    const order = await this.orderService.create(user, createOrderDto);
    if (order && createOrderDto.email) {
      this.mailClient.sendMailCreatedOrder(order);
    }
    return order;
  }

  @Get()
  findAll(@Query() filter: FilterParams, ) {
    return this.orderService.findList( filter);
  }
  @Get('/customer')
  findListByCustomer(@Query() filter: FilterParams, @SessionUser() user: SessionUserModel) {
    return this.orderService.findListByCustomer(user, filter);
  }
    @NoGlobalAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
  @Get('/:orderId/products')
  findOrderItemsByOrder(@Param('orderId') orderId: string,) {
    return this.orderService.findOrderItemsByOrder(orderId);
  }

  @Put('/:id/cancel')
  cancel(@Param('id') id: string, @SessionUser() user: SessionUserModel) {
    return this.orderService.updateStatus(id, user, OrderStatus.Cancelled);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() data: UpdateOrderDto, @SessionUser() user: SessionUserModel) {
    return this.orderService.update(id, user, data);
  }
  @Put('/:id/status')
  updateStatus(@Param('id') id: string, @Body() status: OrderStatus, @SessionUser() user: SessionUserModel) {
    return this.orderService.updateStatus(id, user, status);
  }
}
