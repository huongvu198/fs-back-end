import { ConfigOptions, v2 } from 'cloudinary';
import { config } from '../../config/app.config';
import { ConfigService } from '@nestjs/config';

const { apiKey, apiSecret, cloudName } = config.cloudinary;

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  },
  inject: [ConfigService],
};
