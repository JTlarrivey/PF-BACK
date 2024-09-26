import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors, Logger, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FileUploadController {
    private readonly logger = new Logger(FileUploadController.name);

    constructor(private readonly fileUploadService: FileUploadService) {}
    
    @ApiBearerAuth()
    @Post('uploadImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @Param('id') userId: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 2000000, // Tamaño máximo permitido en bytes (2MB por ejemplo)
                        message: 'Supera el máximo permitido',
                    }),
                    new FileTypeValidator({
                        fileType: /^(image\/jpeg|image\/png|image\/webp)$/, // Validación por tipo MIME
                    }),
                ],
            }),
        )
        
        file: Express.Multer.File,
    ) {
        this.logger.log(`Uploading image for user ${userId}`);
        return this.fileUploadService.uploadImage(file, userId);
    }
}
