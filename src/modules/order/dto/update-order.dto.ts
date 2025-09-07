import { PartialType } from '@nestjs/swagger';
import { CustomerCreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CustomerCreateOrderDto) {}
