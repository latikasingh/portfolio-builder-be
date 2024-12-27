import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_PUBLIC_API,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  /**
   * Upload an image to Cloudinary.
   * @param file The file buffer to be uploaded.
   * @param folder The folder name in Cloudinary where the file will be stored.
   * @returns The secure URL of the uploaded image.
   */
  async uploadImage(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        folder: 'protfolio_builder',
        resource_type: 'image',
      };

      cloudinary.uploader
        .upload_stream(
          uploadOptions,
          (error: any, result: UploadApiResponse) => {
            if (error) {
              console.log(error);
              return reject(
                new HttpException(
                  'Image upload failed',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  /**
   * Delete a photo from Cloudinary.
   * @param publicId The public ID of the photo to delete.
   */
  async deletePhoto(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
