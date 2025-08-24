import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SessionUser } from 'src/configs/decorators/session-user.decorator';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly productService: CategoryService) {}

  @Post()
  create(@SessionUser() user: SessionUserModel, @Body() createCategoryDto: CreateCategoryDto) {
    return this.productService.create(user,createCategoryDto);
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
  update(@Param('id') id: string,@SessionUser() user: SessionUserModel, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productService.update(id,user, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @SessionUser() user: SessionUserModel,) {
    return this.productService.remove(id,user);
  }
}
