import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }
  private trimString(value: any): string {
    if (typeof value === 'string') return value.trim();;
    return value
  }
  private trimObject(obj: Record<string, any>): Record<string, any> {
    const trimmedObj: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === 'password') trimmedObj[key] = obj[key]; // Giữ nguyên, ko trim trường password
        else if (this.isObject(obj[key])) trimmedObj[key] = this.trimObject(obj[key]);
        else trimmedObj[key] = this.trimString(obj[key]);
      }
    }
    return trimmedObj;
  }

  transform(value: any, metadata: ArgumentMetadata) {

    if (this.isObject(value) && metadata.type === 'body') 
      return this.trimObject(value);

    return this.trimString(value);
  }
}
