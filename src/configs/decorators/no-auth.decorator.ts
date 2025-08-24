import { SetMetadata } from '@nestjs/common';

export const NO_GLOBAL_AUTH = 'no-auth-key'
export const NoGlobalAuth = (...args: string[]) => SetMetadata(NO_GLOBAL_AUTH, args);
