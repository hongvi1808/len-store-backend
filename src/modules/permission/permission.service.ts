import { Injectable } from '@nestjs/common';
import { PermissionRepo } from './permission.repo';
import { UserRole } from '@prisma/client';

@Injectable()
export class PermissionService {
    constructor(private readonly persRepo: PermissionRepo) {}
    async getPersByRoleId(role: UserRole) {
        const res = await this.persRepo.getPersByRoleId(role)
        return res;
    }
    async getPersByRoledAndUrl(role: UserRole, url: string) {
        const res = await this.persRepo.getPersByRoleAndUrl(role, url)
        return res;
    }
}
