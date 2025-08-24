import { UserRole } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { PhoneNumber } from "src/configs/decorators/phone-number.decorator";

export class CreateUserDto {
    @IsString()
    fullName: string;
    @PhoneNumber()
    phoneNumber?: string;
    @IsString()
    email?: string;
    @IsNumber()
    birthDate?: number;
    @IsOptional()
    role?: UserRole;

}
