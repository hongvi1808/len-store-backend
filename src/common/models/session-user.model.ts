import { UserRole } from "@prisma/client";

export class SessionUserModel {
    sid: string;
    userId: string;
    username: string;
    role: UserRole;

}