import { Body, Controller, Post, Req, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { Resource } from 'nest-keycloak-connect';
import { LoggerService } from '../logger/logger.service';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';  // Updated for multiple files
import { ComsService } from '../services/coms/coms.service';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { HttpStatusCode } from 'axios';


@Controller('cats')
@Resource('cats-service')
export class UploadController {
    constructor(
        private readonly comsService: ComsService,
        private readonly loggerService: LoggerService,
    ) {}


    @Post('/uploadFiles')
    @UseInterceptors(
        FilesInterceptor('files', 20, 
            {
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        const tempDir = path.join(
                            __dirname,
                            '../../temp_uploads',
                            `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                        );
                        fs.mkdirSync(tempDir, { recursive: true });
                        cb(null, tempDir);
                    },
                    filename: (req, file, cb) => {
                        cb(null, file.originalname);
                    },
                }),
            }
        ),
    )
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() fileUpload: { bucketId: string; invoiceId: number },
        @Req() req: Request,
    ) {
        try {
            this.loggerService.log('Upload controller: uploadFiles() start');
            
            if (!files || files?.length === 0) {
                return { message: 'No files uploaded', statusCode: HttpStatusCode.BadRequest, success: false }; 
            }

            this.loggerService.log(`Extracting token from request headers...`);

            const authHeader = req.headers['authorization'] || '';

            this.loggerService.log(`Extracted token: ${authHeader}`);

            const accessTokenJWT = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

            this.loggerService.log(`Extracted token: ${accessTokenJWT}`);
            this.loggerService.log('Upload controller: uploadFiles() calling comsService.uploadFilesToComs() start');

            const { results, summary } = await this.comsService.uploadFilesToComs(files, fileUpload.bucketId, fileUpload.invoiceId, accessTokenJWT);

            this.loggerService.log('Upload controller: uploadFiles() called comsService.uploadFilesToComs() end');
            this.loggerService.log('Upload controller: uploadFiles() end');
            
            const { totalFiles, uploaded, conflicts, errors } = summary;

            // Determine status code
            let statusCode: number;
            if (errors === 0 && conflicts === 0) {
                statusCode = HttpStatusCode.Ok; // 200
            } 
            else if (errors === totalFiles) {
                statusCode = HttpStatusCode.InternalServerError; // 500
            } 
            else if (uploaded > 0 && (errors > 0 || conflicts > 0)) {
                statusCode = HttpStatusCode.MultiStatus; // 207
            } 
            else if (uploaded === 0 && conflicts > 0 && errors === 0) {
                statusCode = HttpStatusCode.Conflict; // 409
            } 
            else {
                statusCode = HttpStatusCode.Ok; // fallback 200
            }

            // Build message parts fast
            const parts = [];
            if (uploaded > 0) parts.push(`${uploaded} file(s) uploaded successfully`);
            if (conflicts > 0) parts.push(`${conflicts} file(s) already existed`);
            if (errors > 0) parts.push(`${errors} file(s) failed to upload`);

            const message =
            parts.length === 0
                ? `No files processed.`
                : parts.length === 1 && errors === 0 && conflicts === 0
                ? `All ${totalFiles} file(s) uploaded successfully.`
                : parts.join(', ') + `. Total: ${totalFiles} file(s) processed.`;

            return {
                message,
                statusCode: statusCode,
                success: summary.errors === 0 && summary.conflicts === 0,
                summary,
                data: results,
            };
        } 
        catch (error) {
            this.loggerService.error('Upload controller: uploadFiles() error', error);
             return {
                message: 'Error uploading files',
                statusCode: HttpStatusCode.InternalServerError,
                success: false,
                summary: {
                    totalFiles: files?.length ?? 0,
                    uploaded: 0,
                    conflicts: 0,
                    errors: files?.length ?? 0,
                },
                data: [],
                error: error.message || 'Unexpected error',
            };
        }
        finally {
            this.loggerService.log('Upload controller: uploadFiles() end');
            const baseTempUploadsDir = path.join(__dirname, '../../temp_uploads');
            fs.readdir(baseTempUploadsDir, (err, files) => {
                if (err) {
                    this.loggerService.warn(`Failed to read temp_uploads directory: ${err.message}`);
                    return;
                }

                files.forEach((folder) => {
                    const folderPath = path.join(baseTempUploadsDir, folder);
                    fs.rm(folderPath, { recursive: true, force: true }, (rmErr) => {
                        if (rmErr) {
                            this.loggerService.warn(`Failed to delete temp folder ${folderPath}: ${rmErr.message}`);
                        } else {
                            this.loggerService.log(`Deleted temp folder ${folderPath}`);
                        }
                    });
                });
            });
        }
    }
}
