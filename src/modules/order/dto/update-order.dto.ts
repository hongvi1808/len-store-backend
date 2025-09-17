import { IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto  {
    @IsString()
    @IsOptional()
    status: OrderStatus
}
