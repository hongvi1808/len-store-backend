import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepo } from './user.repo';
import * as bcrypt from 'bcrypt';
import { FilterParams } from 'src/common/models/filter-params.model';
import { PaginationItemModel } from 'src/common/models/res-success.model';
import { genRandomPassword } from 'src/common/utils/func';
import { uuidv7 } from 'uuidv7';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo){}
  async create(data: CreateUserDto, password?: string) {
    const pass = password || genRandomPassword()
        const hash = bcrypt.hashSync(pass, 10)
        const handleData : Prisma.UserUncheckedCreateInput= {
        id: uuidv7(),
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        hash,
        birthDate: data.birthDate || 0,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        createdBy: data.fullName,
        updatedBy: data.fullName,
        username: data.phoneNumber || data.email || '',
        role: data.role || UserRole.Customer,
      }
    return this.userRepo.create(handleData)
  }

  async findList(filers: FilterParams): Promise<PaginationItemModel<any | null>> {
    return this.userRepo.findList(filers)
  }

  async findOne(id: string) {
    return this.userRepo.findOne(id)
  }
   async findByUsername(username:string) {
        return this.userRepo.findByUsername(username)
    }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
