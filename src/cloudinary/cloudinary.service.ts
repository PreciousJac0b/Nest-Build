import { Injectable } from '@nestjs/common';
import cloudinary from 'src/config/cloudinary.config.js';

@Injectable()
export class CloudinaryService {
  // async uploadImage(file: Express.Multer.File) {
  //   return new Promise((resolve, reject) => {
  //     cloudinary.uploader.upload_stream(
  //       { folder: 'book-covers', resource_type: 'image' },
  //       (error, result) => {
  //         if (error) {
  //           return reject(error);
  //         }
  //         resolve(result);
  //       }
  //     ).end(file.buffer);
  //   });
  // }

  // async deleteImage(publicId: string) {
  //   return new Promise((resolve, reject) => {
  //     cloudinary.uploader.destroy(publicId, (error, result) => {
  //       if (error) {
  //         return reject(error);
  //       }
  //       resolve(result);
  //     });
  //   });
  // } 

  async uploadImage(file: Express.Multer.File) {
    try {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'book-mgt-covers',
          resource_type: 'image',
        },
      );

      return uploadResult;
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(publicId: string) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw error;
    }
  }
}