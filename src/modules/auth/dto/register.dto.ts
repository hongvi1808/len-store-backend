import { UserRole } from "@prisma/client";
import { IsNumber, IsString } from "class-validator";
import { PhoneNumber } from "src/configs/decorators/phone-number.decorator";

export class RegisterAuthDto {
  @PhoneNumber()
  phoneNumber?: string;

  @IsString()
  password: string;

  @IsString()
  email?: string;

  @IsString()
  fullName: string;

  @IsNumber()
  birthDate: number;
  @IsString()
  role?: UserRole;
}