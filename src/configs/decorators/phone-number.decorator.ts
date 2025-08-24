import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { PhoneNumberPipe } from '../pipes/phone-number.pipe';

export const PhoneNumber = () =>
    applyDecorators(
        IsString(),
        Transform(({ value }) => new PhoneNumberPipe().transform(value)),
    )
