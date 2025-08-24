import * as multer from 'multer';
import { FirebaseStorageService } from './firebase-storage.service';
import { NoGlobalAuth } from 'src/configs/decorators/no-auth.decorator';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FIREBASE_STORAGE_DIR_NAME } from '../constants/enums';

@Controller('firebase')
export class FirebaseController {
    constructor(private readonly productService: FirebaseStorageService,
        private firebaseService: FirebaseStorageService
    ) { }

    @Post('storage/get-sign-url')
    async getSignUrl(@Body() body: { keys: string[] }) {
        const result = await this.firebaseService.genSignUrl(body.keys);
        return result;
    }

    @NoGlobalAuth()
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('files'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const result = await this.firebaseService.uploadBuffer([file], FIREBASE_STORAGE_DIR_NAME.Product, 'demo');
        return result;
    }
}
