// import { Injectable } from '@nestjs/common';
// import cloudinary from '../config/cloudinary.config.js';
// import { Readable } from 'stream';`

import { Inject, Injectable } from '@nestjs/common';
import type { v2 as CloudinaryType, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof CloudinaryType) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return this.cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      { folder: 'book-mgt-covers', resource_type: 'image' },
    );
  }

  async deleteImage(publicId: string) {
    return this.cloudinary.uploader.destroy(publicId);
  }
}
