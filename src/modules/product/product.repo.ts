import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { Prisma } from '@prisma/client';
import { forceToInfoPagition, genBaseSlug } from 'src/common/utils/func';
import { FilterParams } from 'src/common/models/filter-params.model';
import { PaginationItemModel } from 'src/common/models/res-success.model';

@Injectable()
export class ProductRepo {
  constructor(private readonly db: PrismaService) { }
  async create(user: SessionUserModel, body: CreateProductDto) {
    const slug = await this.uniqueSlug(genBaseSlug(body.name))
    const data: Prisma.ProductCreateInput = {
      id: uuidv7(),
      name: body.name,
      slug,
      stock: body.stock,
      price: body.price,
      description: body.description,
      createdAt: new Date().getTime(),
      createdBy: user.username,
      updatedAt: new Date().getTime(),
      updatedBy: user.username
    }
    const res = await this.db.product.create({ data, select: { id: true, slug: true } })
    return res;
  }

  async findList(filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.ProductWhereInput = { name: filters.search, alive: true, active: true }
    const items = await this.db.product.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: { id: true, stock: true, slug: true, name: true, description: true, price: true }
    })
    const total = await this.db.product.count({ where: whereOpt })
    return new PaginationItemModel(items, total, page, take)
  }

  async findOne(id: string) {
    const item = await this.db.product.findUnique({
      where: { id },
      select: { id: true, stock: true, slug: true, name: true, description: true, price: true }
    })
    return item
  }

  async update(id: string, user: SessionUserModel, body: UpdateProductDto) {
    const slug = await this.uniqueSlug(genBaseSlug(body.name || ''))
    const data: Prisma.ProductUpdateInput = {
      name: body.name,
      slug,
      stock: body.stock,
      description: body.description,
      updatedAt: new Date().getTime(),
      updatedBy: user.username
    }
    const res = await this.db.product.update({ where: { id }, data, select: { id: true, slug: true } })
    return res;
  }

  async remove(id: string, user: SessionUserModel,) {
    const data: Prisma.ProductUpdateInput = {
      updatedAt: new Date().getTime(),
      updatedBy: user.username,
      alive: false
    }
    const res = await this.db.product.update({ where: { id }, data, select: { id: true, slug: true } })
    return res;
  }

  private async uniqueSlug(slug: string) {
    const count = await this.db.product.count({ where: { slug, alive: true } })
    return count ? `${slug}-${count + 1}` : slug
  }
}
