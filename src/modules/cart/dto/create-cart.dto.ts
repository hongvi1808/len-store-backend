import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateCartDto {
    @ApiProperty({
      type: `integer`,
      format: `int32`,
    })
     @Type(() => Number)
      @IsInt()
    quantity: number ;

    @IsString()
    productId: string

    @IsOptional()
    classify: any

}
