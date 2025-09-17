import { IsOptional, IsString } from "class-validator";
import { PhoneNumber } from "src/configs/decorators/phone-number.decorator";

export class LoginAuthDto {
    @IsString()
    @IsOptional()
    username: string;
    @IsOptional()
    @PhoneNumber()
    phoneNumber: string;

    @IsString()
    password: string;
}