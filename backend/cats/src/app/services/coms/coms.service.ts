import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { firstValueFrom } from 'rxjs';
import { DownloadType } from '../../utilities/enums/coms/downloadType.enum';
import * as fs from 'fs';
import { HttpStatusCode } from 'axios';


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

  async createBucket(bucketName: string, bucketKey: string, context: any) {
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

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context?.req?.accessTokenJWT || ''}`,
      };
      // Using `firstValueFrom` instead of `toPromise()`
      const response = await firstValueFrom(
        this.httpService.put(`${this.comsApi}${this.bucket_path}`, params, { headers }),
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

  async deleteBucket(bucketId: string, context: any) {
    try {
      this.loggerService.log(`Deleting bucket with ID: ${bucketId}`);

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context?.req?.accessTokenJWT || ''}`,
      };

      const response = await firstValueFrom(
        this.httpService.delete(`${this.comsApi}${this.bucket_path}/${bucketId}`, { headers }),
      );

      if (response?.status === HttpStatusCode.NoContent) {
        this.loggerService.log(`Deleted bucket with ID: ${bucketId}`);
        return true;
      }
    }
    catch (error) {
      this.loggerService.error('Error deleting bucket', error);
      throw new Error(`Failed to delete bucket: ${error.message}`);
    }
  }

  async uploadFilesToComs(files: Express.Multer.File[], bucketId: string, invoiceId: number, accessTokenJWT: any) {
    // Type confusion protection: ensure files is an array of objects
    if (!Array.isArray(files) || !files.every(f => typeof f === 'object' && f !== null && typeof f.originalname === 'string' && typeof f.path === 'string')) {
      this.loggerService.log('Invalid files parameter: expected an array of Express.Multer.File objects');
      throw new Error('Invalid files parameter: expected an array of files');
    }
    try {
      this.loggerService.log(`Starting upload of ${files.length} files to bucket: ${bucketId}`);

      const uploadPromises = files.map(async (file) => {
        const fileStream = fs.createReadStream(file.path);

        try {
          const response = await this.createObject(bucketId, file.originalname, file.mimetype, fileStream, accessTokenJWT);
          if (response?.status === HttpStatusCode.Ok || response?.status === HttpStatusCode.Created) {
            return {
              bucketId,
              invoiceId,
              fileName: file.originalname || '',
              objectId: response?.data.id || '',
              isAlreadyExist: false,
              errorMessage: null,
              statusCode: response?.status,
            };
          }

          if (response.status === HttpStatusCode.Conflict || response.fileAlreadyExists) {
            return {
              bucketId,
              invoiceId,
              fileName: file.originalname || '',
              objectId: '',
              isAlreadyExist: true,
              errorMessage: response?.errorMessage || 'File already exists',
              statusCode: response?.status,
            };
          }

          return {
            bucketId,
            invoiceId,
            fileName: file.originalname || '',
            objectId: response?.data?.id || '',
            isAlreadyExist: false,
            errorMessage: `Upload failed: ${response.errorMessage}` || 'Unknown error',
            statusCode: response?.status,
          };
        }
        catch (err) {
          this.loggerService.error(`Failed uploading ${file.originalname}`, err);
          return {
            bucketId,
            invoiceId,
            objectId: '',
            isAlreadyExist: false,
            errorMessage: err.message || 'Unknown error',
            statusCode: HttpStatusCode.InternalServerError,
          };
        }
        finally {
          fileStream.close();
        }
      });

      const results = await Promise.all(uploadPromises);

      const summary = {
        totalFiles: results.length,
        uploaded: results.filter(r => !r.isAlreadyExist && !r.errorMessage).length,
        conflicts: results.filter(r => r.isAlreadyExist).length,
        errors: results.filter(r => r.errorMessage && !r.isAlreadyExist).length,
      };

      this.loggerService.log(`Completed uploading files: ${summary.uploaded} success, ${summary.conflicts} conflicts, ${summary.errors} errors.`);

      return { results, summary };
    }
    catch (error) {
      this.loggerService.error('Error uploading files to bucket', error);
      throw new Error(`Failed to upload files: ${error.message}`);
    }
  }

  async createObject(bucketId: string, fileName: string, mimeType: string, fileStream: fs.ReadStream, accessTokenJWT: any): Promise<any> {
    try {
      this.loggerService.log(`Uploading file ${fileName} to bucket: ${bucketId}`);

      const stats = await fs.promises.stat(fileStream.path);
      const fileSizeInBytes = stats.size;


      const config = {
        headers: {
          'Content-Disposition': this.setDispositionHeader(fileName),
          'Content-Type': mimeType || 'application/octet-stream',
          'Content-Length': fileSizeInBytes.toString(),
          'x-amz-bucket': bucketId,
          Authorization: `Bearer ${accessTokenJWT || ''}`,
        },
        params: { bucketId },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      };

      this.loggerService.log(`PUT ${this.comsApi}${this.object_path}`);

      const response = await firstValueFrom(
        this.httpService.put(`${this.comsApi}${this.object_path}`, fileStream, config)
      );

      this.loggerService.log(`Response status: ${response.status}`);

      return response;
    }
    catch (error) {
      this.loggerService.error(`Error uploading ${fileName} to bucket`, error);
      if (error?.response?.status === HttpStatusCode.Conflict) {
        // Handle 409 error explicitly here as well
        return {
          status: error?.response?.status,
          fileAlreadyExists: true,
          errorMessage: `File ${fileName} already exists. Please upload a different file or change the file name.`,
        };
      }
      else {
        return {
          status: error?.response?.status,
          errorMessage: `Failed to upload ${fileName}: ${error.message}`,
        };
      }
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

  async deleteObject(objectId: string, context: any, versionId?: string) {
    try {
      this.loggerService.log(`Deleting object with ID: ${objectId}`);
      const params = versionId ? { s3VersionId: versionId } : {};

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context?.req?.accessTokenJWT || ''}`,
      };

      const response = await firstValueFrom(
        this.httpService.delete(`${this.comsApi}${this.object_path}/${objectId}`, { params, headers }),
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
    try {
      this.loggerService.log(`Setting file public in bucket: ${bucketId}`);

      const params = {
        public: true,
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
