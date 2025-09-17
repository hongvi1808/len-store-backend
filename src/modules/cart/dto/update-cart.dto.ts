import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateCartDto  {
      @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
         @Type(() => Number)
             @IsInt()
        quantity: number ;
    
        @IsOptional()
        classify: any
}
