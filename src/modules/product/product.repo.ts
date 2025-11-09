import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { SessionUserModel } from '../../common/models/session-user.model';
import { CategoryTags, Prisma } from '@prisma/client';
import { forceToInfoPagition, genBaseSlug } from '../../common/utils/func';
import { FilterParams } from '../../common/models/filter-params.model';
import { PaginationItemModel } from '../../common/models/res-success.model';
import { ProductRes } from './entities/product.entity';

const defaultSelect = {
  id: true, name: true, slug: true, images: true, classify: true,
  stock: true, price: true, description: true,
}
@Injectable()
export class ProductRepo {
  constructor(private readonly db: PrismaService) { }
  async create(user: SessionUserModel, body: CreateProductDto) {
    const slug = await this.uniqueSlug(genBaseSlug(body.name))
    const data: Prisma.ProductUncheckedCreateInput = {
      id: uuidv7(),
      name: body.name,
      slug,
      stock: body.stock,
      images: body.images,
      price: body.price,
      description: body.description,
      createdAt: new Date().getTime(),
      createdBy: user.username,
      updatedAt: new Date().getTime(),
      updatedBy: user.username,
      productCategories: {
        create: body.categoryIds?.map(i => ({
          id: uuidv7(),
          categoryId: i,
          createdAt: new Date().getTime(),
          createdBy: user.username,
          updatedAt: new Date().getTime(),
          updatedBy: user.username,
        }))
      }
    }
    const res = await this.db.product.create({ data, select: { ...defaultSelect, productCategories: { select: { categoryId: true } } } })
    return res;
  }

  async findList(filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.ProductWhereInput = { alive: true, active: true }
    const items = await this.db.product.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: { ...defaultSelect, productCategories: { select: { categoryId: true } } }
    })
    const total = await this.db.product.count({ where: whereOpt })
    const res: ProductRes[] = items.map(i => ({
      id: i.id,
      stock: i.stock,
      slug: i.slug,
      name: i.name,
      images: i.images,
      price: i.price,
      description: i.description,
      classify: i.classify,
      categoryIds: i.productCategories.map(j => j.categoryId)
    }))
    return new PaginationItemModel(res, total, page, take)
  }
  async findListByCategory(categoryId: string, filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.ProductCategoryWhereInput = { alive: true, active: true, categoryId }
    const items = await this.db.productCategory.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: { id: true, product: { select: defaultSelect } }
    })
    const total = await this.db.productCategory.count({ where: whereOpt })
    const res: ProductRes[] = items?.map(i => i.product).map(i => ({
      id: i.id,
      stock: i.stock,
      slug: i.slug,
      name: i.name,
      images: i.images,
      price: i.price,
      classify: i.classify,

      description: i.description,
    }))
    return new PaginationItemModel(res, total, page, take)
  }
  async findListBySlugCategory(slug: string, filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.ProductCategoryWhereInput = { alive: true, active: true, category: { slug } }
    const items = await this.db.productCategory.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: { id: true, product: { select: defaultSelect } }
    })
    const total = await this.db.productCategory.count({ where: whereOpt })
    const res: ProductRes[] = items?.map(i => i.product).map(i => ({
      id: i.id,
      stock: i.stock,
      slug: i.slug,
      name: i.name,
      images: i.images,
      price: i.price, classify: i.classify,

      description: i.description,
    }))
    return new PaginationItemModel(res, total, page, take)
  }
  async findListByTag(tag: CategoryTags, filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt: Prisma.ProductWhereInput = { alive: true, productCategories: { some: { category: { tag } } } }
    const items = await this.db.product.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select:  defaultSelect 
    })
    const total = await this.db.product.count({ where: whereOpt })
    const res: ProductRes[] = items?.map(i => ({
      id: i.id,
      stock: i.stock,
      slug: i.slug,
      name: i.name,
      images: i.images, classify: i.classify,

      price: i.price,
      description: i.description,
    }))
    return new PaginationItemModel(res, total, page, take)
  }

  async findBySlug(slug: string) {
    const item = await this.db.product.findFirst({
      where: { slug },
      select: defaultSelect
    })
    if (!item) return null
    const res: ProductRes = {
      id: item.id,
      stock: item.stock,
      slug: item.slug,
      images: item.images,
      name: item.name, classify: item.classify,

      price: item.price,
      description: item.description,
    }
    return res
  }
  async findOne(id: string) {
    const item = await this.db.product.findUnique({
      where: { id },
      select: { ...defaultSelect, productCategories: { select: { categoryId: true } } }
    })
    if (!item) return null
    const res: ProductRes = {
      id: item.id,
      stock: item.stock,
      slug: item.slug,
      images: item.images,
      name: item.name,
      price: item.price, classify: item.classify,

      description: item.description,
      categoryIds: item.productCategories.map(j => j.categoryId)
    }
    return res
  }

  async update(id: string, user: SessionUserModel, body: UpdateProductDto) {
    const slug = await this.uniqueSlug(genBaseSlug(body.name || ''))
    const data: Prisma.ProductUpdateInput = {
      name: body.name,
      slug,
      stock: body.stock,

      description: body.description,
      updatedAt: new Date().getTime(),
      updatedBy: user.username,
      productCategories: {
        deleteMany: {},
        create: body.categoryIds?.map(i => ({
          id: uuidv7(),
          categoryId: i,
          createdAt: new Date().getTime(),
          createdBy: user.username,
          updatedAt: new Date().getTime(),
          updatedBy: user.username,
        }))
      }
    }
    const res = await this.db.product.update({ where: { id }, data, select: { ...defaultSelect, productCategories: { select: { categoryId: true } } } })
    return res;
  }

  async remove(id: string, user: SessionUserModel,) {
    const data: Prisma.ProductUpdateInput = {
      updatedAt: new Date().getTime(),
      updatedBy: user.username,
      alive: false
    }
    const res = await this.db.product.update({ where: { id }, data, select: defaultSelect })
    return res;
  }

  private async uniqueSlug(slug: string) {
    const count = await this.db.product.count({ where: { slug, alive: true } })
    return count ? `${slug}-${count + 1}` : slug
  }
}
