import { Body, Controller, HttpStatus, Post, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resource } from 'nest-keycloak-connect';
import { LoggerService } from '../logger/logger.service';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';  // Updated for multiple files
import { ComsService } from '../services/coms/coms.service';
import { Context } from '@nestjs/graphql';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('cats')
@Resource('cats-service')
export class UploadController {
    constructor(
        private readonly comsService: ComsService,
        private readonly loggerService: LoggerService,
    ) {}

    @Post('/uploadFiles')
    @UseInterceptors(
        FileFieldsInterceptor([
        { name: 'files', maxCount: 10 }, // field name must match frontend
        ]),
    )
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
    }))
    async uploadFiles(
        @UploadedFiles() files: { files?: Express.Multer.File[] },
        @Body() fileUpload: { bucketId: string, invoiceId: number },
        @Context() context: any
    ) {
        try {
            this.loggerService.log('Upload controller: uploadFiles() start');
            
            if (!files || files?.files?.length === 0) {
                return { message: 'No files uploaded', statusCode: HttpStatus.BAD_REQUEST, success: false };
            }

            // Pass the array of files to the service method
            const response = await this.comsService.uploadFilesToComs(files?.files, fileUpload.bucketId, fileUpload.invoiceId, context);
            
            this.loggerService.log('Upload controller: uploadFiles() end');
            return response;

        } catch (error) {
            this.loggerService.error('Upload controller: uploadFiles() error', error);
            throw new Error('Failed to upload files.');
        }
    }
}
