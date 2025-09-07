import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCartDto  {
      @ApiProperty({
          type: `integer`,
          format: `int32`,
        })
        quantity: number ;
    
    
        @IsOptional()
        classify: any
}
