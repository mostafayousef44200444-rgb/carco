// src/cars/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    });
  }

  uploadBuffer(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'cars_store', transformation: [{ width: 800, height: 800, crop: 'limit' }] },
          (err, result) => {
            if (err) return reject(err);
            resolve(result?.secure_url ?? '');
          },
        )
        .end(buffer);
    });
  }
}