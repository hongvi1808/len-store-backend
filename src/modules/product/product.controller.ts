import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SessionUser } from '../../configs/decorators/session-user.decorator';
import { SessionUserModel } from '../../common/models/session-user.model';
import { FilterParams } from '../../common/models/filter-params.model';
import { NoGlobalAuth } from '../../configs/decorators/no-auth.decorator';
import { CategoryTags } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  @NoGlobalAuth()
  @Get('/category/slug/:slug')
  findAllBySlugCategory(@Param('slug') slug: string, @Query() filter: FilterParams) {
    return this.productService.findListBySlugCategory(slug, filter);
  }
  @NoGlobalAuth()
  @Get('/tag/:tag')
  findAllByTag(@Param('tag') tag: CategoryTags, @Query() filter: FilterParams) {
    return this.productService.findListByTag(tag, filter);
  }
  @NoGlobalAuth()
  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }


  @Post('/')
  create(@SessionUser() user: SessionUserModel, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(user, createProductDto);
  }

  @Get('/')
  findAll(@Query() filter: FilterParams) {
    return this.productService.findList(filter);
  }
  @Get('/category/:id')
  findAllByCategory(@Param('id') categoryId: string, @Query() filter: FilterParams) {
    return this.productService.findListByCategory(categoryId, filter);
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
