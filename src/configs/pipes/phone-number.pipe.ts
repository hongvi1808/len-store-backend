import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PhoneNumberPipe implements PipeTransform {
  transform(value: any) {
    if (!(/^[0-9+]+$/.test(value))) 
      throw new BadRequestException('Số điện thoại chỉ được chứa các ký tự số và dấu cộng (+)');

    // transform
    if (/^016\d{9}$/.test(value)) return value.replace(/^016/, '+84');
    if (/^0\d{9}$/.test(value)) return value.replace(/^0/, '+84');
    if (/^84\d{9}$/.test(value)) return '+' + value;
    if (/^\+84\d{9}$/.test(value)) return value;
    if (/^\d{9}$/.test(value)) return '+84' + value;
    throw new BadRequestException('Số điện thoại không hợp lệ (VN)');
  }
}
