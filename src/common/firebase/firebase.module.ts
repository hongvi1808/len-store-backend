import { Module } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseController } from './firebase.controller';

@Module({
  imports: [ConfigModule],
  controllers: [FirebaseController],
  providers: [FirebaseStorageService],
  exports: [FirebaseStorageService],
})
export class FirebaseModule {}
