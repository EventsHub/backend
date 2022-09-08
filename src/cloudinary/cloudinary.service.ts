import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        return error ? reject(error) : resolve(result);
      });
      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteImage(url: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(this.castPublicIdInUrl(url), (error, result) => {
        return error ? reject(error) : resolve(result);
      });
    });
  }

  private castPublicIdInUrl(url: string): string {
    const urlPartArray = url.split('/');
    const lastPart = urlPartArray[urlPartArray.length - 1];
    return lastPart.split('.')[0];
  }
}
