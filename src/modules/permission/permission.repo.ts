import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { FilterParams } from '../../common/models/filter-params.model';
import { PaginationItemModel } from '../../common/models/res-success.model';
import { PrismaService } from '../../common/prisma/prisma.service';
import { forceToInfoPagition } from '../../common/utils/func';

const defaultSelect = { id: true, name: true, role: true, url: true }
@Injectable()
export class PermissionRepo {
    constructor(private readonly db: PrismaService) { }
    async getPersByRoleId(role: UserRole, filters?: FilterParams) {
        const whereOpt = { role: { has: role }, alive: true, active: true, }
        if (filters) {
            const { skip, take, page } = forceToInfoPagition(filters.page, filters.limit)
            const items = await this.db.permission.findMany({
                where: { ...whereOpt },
                orderBy: { updatedAt: 'desc' },
                skip, take,
                select: defaultSelect
            })
            const total = await this.db.permission.count({ where: whereOpt })
            return new PaginationItemModel(items, total, page, take)
        }

        return await this.db.permission.findMany({
            where: whereOpt,
            orderBy: { updatedAt: 'desc' },
            select: defaultSelect
        })
    }
    async getPersByRoleAndUrl(role: UserRole, url: string) {
        const res = await this.db.permission.findFirst({
            where: { role: { has: role }, url, active: true, alive: true },
            select: defaultSelect
        })
        return res;
    }
}