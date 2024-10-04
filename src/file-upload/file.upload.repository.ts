import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import toStream from 'buffer-to-stream';

@Injectable()
export class FileUploadRepository {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Detecta automáticamente el tipo de archivo
        (error, result) => {
          if (error) {
            reject(error); // Si hay error, rechaza la promesa
          } else {
            resolve(result); // Si tiene éxito, resuelve la promesa con el resultado
          }
        }
      );
      toStream(file.buffer).pipe(upload); // Convierte el buffer en stream y lo sube
    });
  }
}
