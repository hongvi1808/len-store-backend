import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepo } from './category.repo';
import { SessionUserModel } from 'src/common/models/session-user.model';
import { FilterParams } from 'src/common/models/filter-params.model';
import { CategoryRes } from './entities/category.entity';
import { PaginationItemModel } from 'src/common/models/res-success.model';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) { }
  async create(user: SessionUserModel, body: CreateCategoryDto) {
    return this.categoryRepo.create(user, body)
  }

  async findList(filers: FilterParams): Promise<PaginationItemModel<CategoryRes | null>> {
    return this.categoryRepo.findList(filers)
  }

  async findOne(id: string): Promise<CategoryRes | null> {
    return this.categoryRepo.findOne(id)
  }

  update(id: string, user: SessionUserModel, body: UpdateCategoryDto) {
    return this.categoryRepo.update(id, user, body)
  }

  remove(id: string, user: SessionUserModel) {
    return this.categoryRepo.remove(id, user)
  }
}
