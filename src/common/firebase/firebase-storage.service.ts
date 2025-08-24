import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { uuidv7 } from 'uuidv7';
import * as path from 'path';
import { getStorage } from 'firebase-admin/storage';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class FirebaseStorageService implements OnModuleInit {
  private bucket: Bucket;
  constructor(private readonly configService: ConfigService) {

  }

  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert(
        path.resolve(this.configService.get<string>('FIREBASE_KEY_FILE', '')),
      ),
      storageBucket: this.configService.get<string>('FIREBASE_BUCKET'),
    });
    this.bucket = getStorage().bucket()

  }

  async uploadBuffer(files: Express.Multer.File[], dir: string, itemId?: string): Promise<string[]> {
    const path = files.map((file, idx):  Promise<string> => {
      const extension = file.originalname.split('.')?.[1]
      const fileName = `${uuidv7()}-${file.size}.${extension}`;
      const path = `${dir}/${itemId}/${fileName}`
      const fileStorage = this.bucket.file(path)
      return new Promise((resolve, reject) => {
        fileStorage.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
            // metadata: {
            //   firebaseStorageDownloadTokens: uuidv7()
            // }
          }
        }).then(() => {
          resolve(path)
        }
        ).catch((error: any) => {
          reject(error);
        })

      })

    })

    return await Promise.all(path);
  }

  async genSignUrl(path: string[]): Promise<string[]> {
    const urls: any  = path.map((p) : Promise<string> => {
      const file = this.bucket.file(p);
      return new Promise((resolve, reject) => {
        file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 30*60*1000
        }).then(([url]) => resolve(url)).catch(err => reject(err))

      })
    })
    return await Promise.all(urls)
  }
}
