import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SYSTEM_KEY } from 'src/common/constants/enums';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(SYSTEM_KEY.GooglePassportKey) {}

