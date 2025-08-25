import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsArray()
  categoryIds: string[]

  @Type(() => Number)
  @IsInt()
  stock: number

  @Type(() => Number)
  @ApiProperty({
    type: `integer`,
    format: `int32`,
  })
  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
