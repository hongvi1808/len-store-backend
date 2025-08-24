import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    categoryId: string

    @IsInt()
    stock: number

    @ApiProperty({
      type: `integer`,
      format: `int32`,
    })
    @IsInt()
    price: number ;

    @IsOptional()
    @IsString()
    description?: string;
}
