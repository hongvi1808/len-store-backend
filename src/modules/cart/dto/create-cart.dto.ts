import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCartDto {
    @ApiProperty({
      type: `integer`,
      format: `int32`,
    })
    quantity: number ;

    @IsString()
    productId: string

    @IsString()
    @IsString()
    customerId?: string
}
