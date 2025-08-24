import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsOptional()
    @IsString()
    customerId: string  | null;

    @ApiProperty({
      type: `number`,
      format: `float`,
    })
    @IsString()
    totalPrice: number ;

    @IsArray()
    products: ProductInOrderItem[]
}

class ProductInOrderItem {
  id: string;
  price: number;
  name: string;
  quantity: number}