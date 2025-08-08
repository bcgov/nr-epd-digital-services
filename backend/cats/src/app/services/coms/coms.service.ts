import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { firstValueFrom } from 'rxjs';
import { DownloadType } from '../../utilities/enums/coms/downloadType.enum';



@Injectable()
export class ComsService {
    private readonly accessKeyId: string;
    private readonly secretAccessKey: string;
    private readonly region: string;
    private readonly bucket: string;
    private readonly endpoint: string;
    private readonly active: boolean;
    private readonly comsApi: string;
    private readonly bucket_path: string;
    private readonly object_path: string;
    private readonly downloadType: DownloadType;


    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly loggerService: LoggerService,
    ) {
        
        this.accessKeyId = this.configService.get<string>('VITE_S3_STORAGE_ACCESS_KEY_ID');
        this.secretAccessKey = this.configService.get<string>('VITE_S3_STORAGE_SECRET_ACCESS_KEY');
        this.region = this.configService.get<string>('VITE_S3_STORAGE_REGION');
        this.bucket = this.configService.get<string>('VITE_S3_STORAGE_BUCKET');
        this.endpoint = this.configService.get<string>('VITE_S3_STORAGE_ENDPOINT');
        this.comsApi = this.configService.get<string>('VITE_COMS_API');
        this.bucket_path = this.configService.get<string>('VITE_COMS_BUCKET');
        this.object_path = this.configService.get<string>('VITE_COMS_OBJECT');
        this.downloadType = DownloadType.URL;
        this.active = true;
    }

    async createBucket(bucketName: string, bucketKey: string,  context: any) {
        try {
            this.loggerService.log(`Creating bucket: ${bucketName}, with key: ${bucketKey}`);
            const params = {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
                endpoint: this.endpoint,
                region: this.region,
                bucket: this.bucket,
                active: this.active,
                bucketName: bucketName,
                key: bucketKey,
            };

            const  headers = { 
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${  context?.req?.accessTokenJWT || ''}`,
             };
            // Using `firstValueFrom` instead of `toPromise()`
            const response = await firstValueFrom(
                this.httpService.put(`${this.comsApi}${this.bucket_path}`, params, { headers: { 'Content-Type': 'application/json' } }),
            );

            if (response?.data) {
                this.loggerService.log(`Created bucket: ${bucketName}`);
                return { bucketId: response.data.bucketId };
            }
            throw new Error('Bucket creation failed, no response data.');
        } 
        catch (error) {
            this.loggerService.error('Error creating bucket', error);
            throw new Error(`Failed to create bucket: ${error.message}`);
        }
    }

    async deleteBucket(bucketId: string,  context: any) {
        try {
            this.loggerService.log(`Deleting bucket with ID: ${bucketId}`);

            const headers = { 
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${  context?.req?.accessTokenJWT || ''}`,
             };

            const response = await firstValueFrom(
                this.httpService.delete(`${this.comsApi}${this.bucket_path}/${bucketId}`, { headers }),
            );

            if (response?.data) {
                this.loggerService.log(`Deleted bucket with ID: ${bucketId}`);
                return true;
            }
            throw new Error('Bucket deletion failed, no response data.');
        } 
        catch (error) {
            this.loggerService.error('Error deleting bucket', error);
            throw new Error(`Failed to delete bucket: ${error.message}`);
        }
    }

    async uploadFilesToComs(files: Express.Multer.File[], bucketId: string, invoiceId: number,  context: any) {
        try {
            this.loggerService.log(`Uploading files to bucket: ${bucketId}`);
            const promises = files.map(async (file) => {
                try {
                    this.loggerService.log(`Uploading file to bucket: ${bucketId}`);
                    const response = await this.createObject(bucketId, file,  context);
                    return {
                        bucketId,
                        invoiceId,
                        fileName: file.originalname,
                        fileAlreadyExists: response?.fileAlreadyExists || false,
                        errorMessage: response?.errorMessage || '',
                        objectId : response?.objectId || '',
                    };
                } 
                catch (error) {
                    this.loggerService.error('Error uploading files to bucket', error);
                    return {
                        bucketId,
                        invoiceId,
                        fileName: file.originalname,
                        fileAlreadyExists: false,
                        errorMessage: `Failed to upload file: ${error.message}`,
                        objectId: '',
                    };
                }
            });
            const results = await Promise.all(promises);
            return results;
        } 
        catch (error) {
            this.loggerService.error('Error uploading files to bucket', error);
            throw new Error(`Failed to upload files: ${error.message}`);
        }
    }

    async createObject(bucketId: string, file: any,  context: any) {
        try {
            this.loggerService.log(`Uploading file to bucket: ${bucketId}`);

            const config = {
                headers: {
                    'Content-Disposition': this.setDispositionHeader(file.name),
                    'Content-Type': file.type || 'application/octet-stream',
                    Authorization: `Bearer ${  context?.req?.accessTokenJWT || ''}`,
                },
                params: {
                    bucketId: bucketId,
                },
            };

            const response = await firstValueFrom(
                this.httpService.put(`${this.comsApi}${this.object_path}`, file, config),
            );

            if( response?.status === HttpStatus.CONFLICT ) {
                // Return an object indicating a conflict without throwing the error
                return { 
                    fileAlreadyExists: true,
                    errorMessage: `File ${file.originalname} already exists. Please upload a different file or change the file name.`,
                };
            }

            if (response?.data) {
                return { 
                    objectId: response.data.id,
                    fileAlreadyExists: false,
                };
            }
            throw new Error('File upload failed, no response data.');
        } 
        catch (error) {
            this.loggerService.error('Error uploading object to bucket', error);
            throw new Error(`Failed to upload object: ${error.message}`);
        }
    }

    async getObject(objectId: string, downloadType: DownloadType = this.downloadType, context: any) {
        try {
            this.loggerService.log(`Downloading object from bucket: ${objectId}`);

            // Prepare the request configuration based on download type
            const params = { download: downloadType };
    
            // Type-safe configuration for Axios
            const config: any = {
                params,
                responseType: downloadType === 'proxy' ? 'blob' : 'json',
                headers: {
                    Authorization: `Bearer ${context?.req?.accessTokenJWT || ''}`,
                },
            };

            // Make the GET request to the backend
            const response = await firstValueFrom(
                this.httpService.get(`${this.comsApi}${this.object_path}/${objectId}`, config),
            )

            if (response?.data) {
                return {
                    downloadUrl: response.data,
                };
            }
            throw new Error('Object download failed, no response data.');
        } 
        catch (error) {
            this.loggerService.error('Error downloading object from bucket', error);
            throw new Error(`Failed to download object: ${error.message}`);
        }
    }

    async deleteObject(objectId: string,  context: any, versionId?: string) {
        try {
            this.loggerService.log(`Deleting object with ID: ${objectId}`);
            const params = versionId ? { s3VersionId: versionId } : {};

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${  context?.req?.accessTokenJWT || ''}`,
            };

            const response = await firstValueFrom(
                this.httpService.delete(`${this.comsApi}${this.object_path}/${objectId}`, { params , headers }),
            );

            if (response?.data) {
                this.loggerService.log(`Deleted object with ID: ${objectId}`);
                return response.data;
            }

            this.loggerService.log(`Failed to delete object with ID: ${objectId}`);
            throw new Error('Object deletion failed, no response data.');
        } 
        catch (error) {
            this.loggerService.error('Error deleting object', error);
            throw new Error(`Failed to delete object: ${error.message}`);
        }
    }

    async setFilePublic(bucketId: string) {
        try{
            this.loggerService.log(`Setting file public in bucket: ${bucketId}`);

            const params = {
                public : true,
            };

            const response = await firstValueFrom(
                this.httpService.patch(`${this.comsApi}${this.object_path}/${bucketId}/public`, null, { params }),
            );

            if (response?.data) {
                return response.data;
            }

            throw new Error('Setting file public failed, no response data.');
        } 
        catch (error) {
            this.loggerService.error('Error setting file public in bucket', error);
            throw new Error(`Failed to set file public: ${error.message}`);
        }
    }

    setDispositionHeader(filename: string) {
        try {
            // Basic header with a fallback to filename encoding
            const dispositionHeader = `attachment; filename="${filename}"`;

            // Encode filename if it has special characters
            const encodedFilename = encodeURIComponent(filename).replace(
            /[!'()*]/g,
            (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
            );

            // Only modify the header if filename was changed (i.e., if it's encoded)
            if (filename !== encodedFilename) {
            return `${dispositionHeader}; filename*=UTF-8''${encodedFilename}`;
            }

            return dispositionHeader;
        } 
        catch (error) {
            this.loggerService.error(`ComsService: setDispositionHeader: Error - ${error.message}`, null);
            throw new Error(`Failed to set disposition header: ${error.message}`);
        }
    }
}
