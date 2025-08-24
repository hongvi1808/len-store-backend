import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterParams } from 'src/common/models/filter-params.model';
import { forceToInfoPagition } from 'src/common/utils/func';
import { Prisma } from '@prisma/client';
import { PaginationItemModel } from 'src/common/models/res-success.model';

@Injectable()
export class UserRepo {
  constructor(private readonly db: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<any> {
    const result = await this.db.user.create({
      data,
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
        email: true,
        role: true,
        hash: true
      },
    });
    return result;
  }

  async findList(filters: FilterParams) {
    const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
    const whereOpt = { fullName: filters.search, alive: true, active: true }
    const items = await this.db.user.findMany({
      where: whereOpt,
      orderBy: { updatedAt: 'desc' },
      skip, take,
      select: { id: true, fullName: true, phoneNumber: true, email: true, birthDate: true }
    })
    const total = await this.db.user.count({ where: whereOpt })
    return new PaginationItemModel(items, total, page, take)
  }

  async findOne(id: string): Promise<any> {
    const foundUser = await this.db.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
        email: true,
      },
    });
    return foundUser;
  }
  async findByUsername(username: string): Promise<any> {
    const foundUser = await this.db.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
        email: true,
      },
    });
    return foundUser;
  }
  async findByPhoneNumber(phoneNumber: string): Promise<any> {
    const foundUser = await this.db.user.findFirst({
      where: {
        phoneNumber: phoneNumber, alive: true, active: true
      },
    });
    return foundUser;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
