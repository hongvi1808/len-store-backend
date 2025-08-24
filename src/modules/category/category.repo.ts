import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { Prisma } from '@prisma/client';
import { forceToInfoPagition, genBaseSlug } from 'src/common/utils/func';
import { FilterParams } from 'src/common/models/filter-params.model';
import { PaginationItemModel } from 'src/common/models/res-success.model';

@Injectable()
export class CategoryRepo {
  constructor(private readonly db: PrismaService) { }
  async create(user: SessionUserModel, body: CreateCategoryDto) {
    const slug = await this.uniqueSlug(genBaseSlug(body.name))
    const data: Prisma.CategoryCreateInput = {
      id: uuidv7(),
      name: body.name,
      slug,
      createdAt: new Date().getTime(),
      createdBy: user.username,
      updatedAt: new Date().getTime(),
      updatedBy: user.username
    }
    const res = await this.db.category.create({ data, select: { id: true, slug: true } })
    return res;
  }

  async findList(filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.CategoryWhereInput = { name: filters.search, alive: true, active: true }
    const items = await this.db.category.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: { id: true, slug: true, name: true }
    })
    const total = await this.db.category.count({ where: whereOpt })
    return new PaginationItemModel(items, total, page, take)
  }

  async findOne(id: string) {
    const item = await this.db.category.findUnique({
      where: { id },
      select: { id: true, slug: true, name: true, }
    })
    return item
  }

  async update(id: string, user: SessionUserModel, body: UpdateCategoryDto) {
    const slug = await this.uniqueSlug(genBaseSlug(body.name || ''))
    const data: Prisma.CategoryUpdateInput = {
      name: body.name,
      slug,
      updatedAt: new Date().getTime(),
      updatedBy: user.username
    }
    const res = await this.db.category.update({ where: { id }, data, select: { id: true, slug: true } })
    return res;
  }

  async remove(id: string, user: SessionUserModel,) {
    const data: Prisma.CategoryUpdateInput = {
      updatedAt: new Date().getTime(),
      updatedBy: user.username,
      alive: false
    }
    const res = await this.db.category.update({ where: { id }, data, select: { id: true, slug: true } })
    return res;
  }

  private async uniqueSlug(slug: string) {
    const count = await this.db.category.count({ where: { slug, alive: true } })
    return count ? `${slug}-${count + 1}` : slug
  }
}
