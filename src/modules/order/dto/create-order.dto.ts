import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { PhoneNumber } from "src/configs/decorators/phone-number.decorator";

export class CustomerCreateOrderDto {
  @IsOptional()
  @IsString()
  customerId: string | null;
  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @PhoneNumber()
  phoneNumber: string | null;

  @IsOptional()
  @IsString()
  email: string | null;

  @IsOptional()
  @IsString()
  address: string | null;
  
  @IsOptional()
  note: string | null;

  @IsString()
  paymentMethod: PaymentMethod

  @ApiProperty({
    type: `number`,
    format: `float`,
  })
  @Type(() => Number)
  @IsInt()
  totalPrice: number;

  @IsArray()
  products: ProductInOrderItem[]
}


class ProductInOrderItem {
  @IsString()
  id: string;

  @Type(() => Number)
  @IsInt()
  price: number;
  
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  quantity: number
}
