import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItemService } from './cart.service';
import { SessionUser } from '../../configs/decorators/session-user.decorator';
import { SessionUserModel } from '../../common/models/session-user.model';
import { FilterParams } from '../../common/models/filter-params.model';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartItemService) {}

   @Post()
   create(@SessionUser() user: SessionUserModel, @Body() body: CreateCartDto) {
     return this.cartService.create(user,body);
   }
   @Post('sync-cart')
   syncCart(@SessionUser() user: SessionUserModel, @Body() body: CreateCartDto[]) {
     return this.cartService.createMany(user,body);
   }
 
   @Get('/')
   findAllByCustomer(@Query() filter: FilterParams, @SessionUser() user: SessionUserModel,) {
     return this.cartService.findListByCustomer(user, filter);
   }
   @Get('/count')
   getCountByCustomer(@SessionUser() user: SessionUserModel) {
     return this.cartService.getCountByCustomer(user.userId);
   }
 
   @Get(':id')
   findOne(@Param('id') id: string) {
     return this.cartService.findOne(id);
   }
 
   @Put(':id')
   update(@Param('id') id: string,@SessionUser() user: SessionUserModel, @Body() body: UpdateCartDto) {
     return this.cartService.update(id,user,body);
   }
 
   @Delete(':id')
   remove(@Param('id') id: string, @SessionUser() user: SessionUserModel,) {
     return this.cartService.remove(id,user);
   }
}
