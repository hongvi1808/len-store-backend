import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItemService } from './cart.service';
import { SessionUser } from 'src/configs/decorators/session-user.decorator';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartItemService) {}

   @Post()
   create(@SessionUser() user: SessionUserModel, @Body() createCategoryDto: CreateCartDto) {
     return this.cartService.create(user,createCategoryDto);
   }
 
   @Get()
   findAll(@Query() filter: FilterParams) {
     return this.cartService.findList(filter);
   }
 
   @Get(':id')
   findOne(@Param('id') id: string) {
     return this.cartService.findOne(id);
   }
 
   @Put(':id')
   update(@Param('id') id: string,@SessionUser() user: SessionUserModel, @Body() updateCategoryDto: UpdateCartDto) {
     return this.cartService.update(id,user, updateCategoryDto);
   }
 
   @Delete(':id')
   remove(@Param('id') id: string, @SessionUser() user: SessionUserModel,) {
     return this.cartService.remove(id,user);
   }
}
