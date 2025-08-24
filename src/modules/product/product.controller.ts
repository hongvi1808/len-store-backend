import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SessionUser } from 'src/configs/decorators/session-user.decorator';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@SessionUser() user: SessionUserModel, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(user, createProductDto);
  }

  @Get()
  findAll(@Query() filter: FilterParams) {
    return this.productService.findList(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @SessionUser() user: SessionUserModel, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, user, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @SessionUser() user: SessionUserModel,) {
    return this.productService.remove(id, user);
  }

}
