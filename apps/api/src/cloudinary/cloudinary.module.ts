import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service.js';
import cloudinary from '../config/cloudinary.config.js';

@Module({
  imports: [ConfigModule],
  providers: [
        {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME');
        const apiKey = config.get<string>('CLOUDINARY_API_KEY');
        const apiSecret = config.get<string>('CLOUDINARY_API_SECRET');

        if (!cloudName || !apiKey || !apiSecret) {
          throw new Error('Missing Cloudinary env vars');
        }

        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });

        return cloudinary;
      },
    },
    CloudinaryService],
    exports: [CloudinaryService, 'CLOUDINARY'],
})
export class CloudinaryModule {}
