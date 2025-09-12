import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SessionUser } from 'src/configs/decorators/session-user.decorator';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';
import { CategoryTags } from '@prisma/client';
import { NoGlobalAuth } from 'src/configs/decorators/no-auth.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @NoGlobalAuth()
  @Get('/tag/:tag')
  findAllByTags(@Param('tag') tag: CategoryTags) {
    return this.categoryService.findAllByTag(tag);
  }
  @Post('/')
  create(@SessionUser() user: SessionUserModel, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(user,createCategoryDto);
  }

  @NoGlobalAuth()
  @Get('/')
  findAll(@Query() filter: FilterParams) {
    return this.categoryService.findList(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string,@SessionUser() user: SessionUserModel, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id,user, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @SessionUser() user: SessionUserModel,) {
    return this.categoryService.remove(id,user);
  }
}
