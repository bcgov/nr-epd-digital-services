import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import axios, { AxiosInstance } from 'axios';

export interface ComsUploadResult {
  success: boolean;
  objectId?: string;
  error?: string;
  conflict?: boolean; // Flag for conflict handling (409 status)
}

export interface ComsBucketResult {
  success: boolean;
  bucketId?: string;
  error?: string;
}

@Injectable()
export class ComsService {
  private readonly comsApiUrl: string;
  private readonly comsAccessKeyId: string;
  private readonly comsBucket: string;
  private readonly comsEndpoint: string;
  private readonly comsAccessRegion: string;
  private readonly comsAccessKey: string;
  private readonly comsAxios: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.comsApiUrl = this.configService.get<string>('COMS_API_URL') || '';
    this.comsAccessKeyId =
      this.configService.get<string>('COMS_ACCESS_KEY_ID') || '';
    this.comsBucket = this.configService.get<string>('COMS_BUCKET') || '';
    this.comsEndpoint = this.configService.get<string>('COMS_ENDPOINT') || '';
    this.comsAccessRegion =
      this.configService.get<string>('COMS_ACCESS_REGION') || 'ca-central-1';
    this.comsAccessKey =
      this.configService.get<string>('COMS_ACCESS_KEY') || '';

    this.comsAxios = axios.create({
      baseURL: this.comsApiUrl,
      timeout: 30000, // 30 seconds for file uploads
    });

    // Request interceptor to add authorization
    this.comsAxios.interceptors.request.use(
      (config) => {
        // Add Authorization header if we have access to user token
        // This would need to be passed from the request context
        // For now, using basic configuration
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  /**
   * Create a bucket in COMS for an application
   * @param applicationId The application ID
   * @returns Bucket creation result
   */
  async createBucket(applicationId: number): Promise<ComsBucketResult> {
    try {
      this.loggerService.log(
        `ComsService: createBucket: applicationId: ${applicationId}`,
      );

      const bucketName = `application-${applicationId}`;
      const bucketKey = `application/${applicationId}`;

      const params = {
        accessKeyId: this.comsAccessKeyId,
        active: true,
        bucket: this.comsBucket,
        bucketName: bucketName,
        endpoint: this.comsEndpoint,
        region: this.comsAccessRegion,
        secretAccessKey: this.comsAccessKey,
        key: bucketKey,
      };

      const response = await this.comsAxios.put('/bucket', params);

      this.loggerService.log(
        `ComsService: createBucket: Success. BucketId: ${response.data.id}`,
      );

      return {
        success: true,
        bucketId: response.data.id,
      };
    } catch (error) {
      this.loggerService.error(
        `ComsService: createBucket: Error creating bucket: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        error: `Failed to create bucket: ${error.message}`,
      };
    }
  }

  /**
   * Create a child bucket for an invoice
   * @param parentBucketId The parent bucket ID
   * @param invoiceId The invoice ID
   * @returns Child bucket creation result
   */
  async createChildBucket(
    parentBucketId: string,
    invoiceId: number,
  ): Promise<ComsBucketResult> {
    try {
      this.loggerService.log(
        `ComsService: createChildBucket: parentBucketId: ${parentBucketId}, invoiceId: ${invoiceId}`,
      );

      const params = {
        bucketName: `invoice-${invoiceId}`,
        subKey: `invoice/${invoiceId}`,
      };

      const response = await this.comsAxios.put(
        `/bucket/${parentBucketId}/child`,
        params,
      );

      this.loggerService.log(
        `ComsService: createChildBucket: Success. BucketId: ${response.data.id}`,
      );

      return {
        success: true,
        bucketId: response.data.id,
      };
    } catch (error) {
      this.loggerService.error(
        `ComsService: createChildBucket: Error creating child bucket: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        error: `Failed to create child bucket: ${error.message}`,
      };
    }
  }

  /**
   * Upload a file to COMS object storage following DocumentEndpoints.ts pattern
   * @param fileBuffer The file buffer
   * @param fileName The original file name
   * @param mimeType The MIME type of the file
   * @param applicationId The application ID
   * @param invoiceId The invoice ID (optional)
   * @param user The authenticated user
   * @returns Upload result with object ID
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    applicationId: number,
    invoiceId?: number,
    user?: any,
  ): Promise<ComsUploadResult> {
    try {
      this.loggerService.log(
        `ComsService: uploadFile: fileName: ${fileName}, applicationId: ${applicationId}, invoiceId: ${invoiceId}`,
      );

      // Get or create bucket for the application
      const bucketResult = await this.createBucket(applicationId);
      if (!bucketResult.success) {
        return {
          success: false,
          error: bucketResult.error,
        };
      }

      let targetBucketId = bucketResult.bucketId!;

      // If we have an invoice ID, create a child bucket
      if (invoiceId) {
        const childBucketResult = await this.createChildBucket(
          targetBucketId,
          invoiceId,
        );
        if (childBucketResult.success) {
          targetBucketId = childBucketResult.bucketId!;
        }
        // If child bucket creation fails, we'll use the parent bucket
      }

      // Create object using the COMS pattern from DocumentEndpoints.ts
      return await this.createObject(
        targetBucketId,
        fileBuffer,
        fileName,
        mimeType,
      );
    } catch (error) {
      this.loggerService.error(
        `ComsService: uploadFile: Error uploading file: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        error: `Failed to upload file: ${error.message}`,
      };
    }
  }

  /**
   * Create an object in COMS following DocumentEndpoints.ts pattern
   * @param bucketId The bucket ID to upload to
   * @param fileBuffer The file buffer
   * @param fileName The file name
   * @param mimeType The MIME type
   * @returns Upload result
   */
  async createObject(
    bucketId: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<ComsUploadResult> {
    try {
      const config = {
        headers: {
          'Content-Disposition': this.setDispositionHeader(fileName),
          'Content-Type': mimeType || 'application/octet-stream',
        },
        params: {
          bucketId: bucketId,
        },
      };

      const response = await this.comsAxios.put('/object', fileBuffer, config);

      this.loggerService.log(
        `ComsService: createObject: Success. ObjectId: ${response.data.id}`,
      );

      return {
        success: true,
        objectId: response.data.id,
      };
    } catch (error) {
      this.loggerService.error(
        `ComsService: createObject: Error creating object: ${error.message}`,
        error.stack,
      );

      let errorMessage = `Failed to upload file: ${error.message}`;

      // Handle specific HTTP status codes like DocumentEndpoints.ts
      if (error.response?.status === 409) {
        errorMessage = 'File with this name already exists';
        return {
          success: false,
          error: errorMessage,
          conflict: true, // Special flag for conflict handling
        };
      } else if (error.response?.status === 413) {
        errorMessage = 'File size exceeds maximum allowed limit';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update an existing object in COMS
   * @param objectId The object ID to update
   * @param fileBuffer The new file buffer
   * @param fileName The file name
   * @param mimeType The MIME type
   * @returns Upload result
   */
  async updateObject(
    objectId: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<ComsUploadResult> {
    try {
      this.loggerService.log(
        `ComsService: updateObject: objectId: ${objectId}, fileName: ${fileName}`,
      );

      const config = {
        headers: {
          'Content-Disposition': this.setDispositionHeader(fileName),
          'Content-Type': mimeType || 'application/octet-stream',
        },
      };

      const response = await this.comsAxios.put(
        `/object/${objectId}`,
        fileBuffer,
        config,
      );

      this.loggerService.log(
        `ComsService: updateObject: Success. ObjectId: ${response.data.id}`,
      );

      return {
        success: true,
        objectId: response.data.id,
      };
    } catch (error) {
      this.loggerService.error(
        `ComsService: updateObject: Error updating object: ${error.message}`,
        error.stack,
      );

      let errorMessage = `Failed to update file: ${error.message}`;

      if (error.response?.status === 409) {
        errorMessage = 'File conflict during update';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get an object from COMS (download)
   * @param objectId The object ID
   * @param downloadType 'url' for redirect URL or 'proxy' for direct download
   * @returns File data or URL
   */
  async getObject(
    objectId: string,
    downloadType: 'url' | 'proxy' = 'url',
  ): Promise<any> {
    try {
      this.loggerService.log(
        `ComsService: getObject: objectId: ${objectId}, downloadType: ${downloadType}`,
      );

      const params = { download: downloadType };
      const config: any = {};

      if (downloadType === 'proxy') {
        config.responseType = 'blob';
      }

      const response = await this.comsAxios.get(`/object/${objectId}`, {
        params,
        ...config,
      });

      this.loggerService.log(`ComsService: getObject: Success`);
      return response.data;
    } catch (error) {
      this.loggerService.error(
        `ComsService: getObject: Error getting object: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to get file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Set file as public
   * @param objectId The object ID
   * @returns Success status
   */
  async setFilePublic(objectId: string): Promise<boolean> {
    try {
      this.loggerService.log(
        `ComsService: setFilePublic: objectId: ${objectId}`,
      );

      const queryParams = {
        public: true,
      };

      await this.comsAxios.patch(`/object/${objectId}/public`, null, {
        params: queryParams,
      });

      this.loggerService.log(`ComsService: setFilePublic: Success`);
      return true;
    } catch (error) {
      this.loggerService.error(
        `ComsService: setFilePublic: Error setting file public: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Delete a file from COMS object storage
   * @param objectId The object ID to delete
   * @returns Success status
   */
  async deleteFile(objectId: string): Promise<boolean> {
    try {
      this.loggerService.log(`ComsService: deleteFile: objectId: ${objectId}`);

      await this.comsAxios.delete(`/object/${objectId}`);

      this.loggerService.log(`ComsService: deleteFile: Success`);
      return true;
    } catch (error) {
      this.loggerService.error(
        `ComsService: deleteFile: Error deleting file: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Delete a bucket from COMS
   * @param bucketId The bucket ID to delete
   * @returns Success status
   */
  async deleteBucket(bucketId: string): Promise<boolean> {
    try {
      this.loggerService.log(
        `ComsService: deleteBucket: bucketId: ${bucketId}`,
      );

      const response = await this.comsAxios.delete(`/bucket/${bucketId}`);

      this.loggerService.log(`ComsService: deleteBucket: Success`);
      return response?.data ? true : false;
    } catch (error) {
      this.loggerService.error(
        `ComsService: deleteBucket: Error deleting bucket: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Get all versions of an object
   * @param objectId The object ID
   * @returns Object versions
   */
  async getObjectVersions(objectId: string): Promise<any[]> {
    try {
      const response = await this.comsAxios.get(`/object/${objectId}/version`);
      return response?.data || [];
    } catch (error) {
      this.loggerService.error(
        `ComsService: getObjectVersions: Error getting versions: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Permanently delete an object and all its versions
   * Following the DocumentEndpoints.ts pattern for complete file deletion
   * @param objectId The object ID to permanently delete
   * @returns Success status
   */
  async permanentObjectDeletion(objectId: string): Promise<boolean> {
    try {
      this.loggerService.log(
        `ComsService: permanentObjectDeletion: objectId: ${objectId}`,
      );

      // Get all versions of the object
      const versions = await this.getObjectVersions(objectId);

      if (versions.length > 0) {
        // Delete each version
        const deletePromises = versions.map(async (version: any) => {
          try {
            const params = version?.s3VersionId
              ? { s3VersionId: version.s3VersionId }
              : {};
            await this.comsAxios.delete(
              `/object/${version?.objectId || objectId}`,
              { params },
            );
          } catch (deleteError) {
            this.loggerService.error(
              `ComsService: permanentObjectDeletion: Error deleting version ${version?.s3VersionId}: ${deleteError.message}`,
              deleteError.stack,
            );
          }
        });

        // Wait for all deletions to complete
        await Promise.all(deletePromises);
      } else {
        // No versions found, delete the object directly
        await this.comsAxios.delete(`/object/${objectId}`);
      }

      this.loggerService.log(`ComsService: permanentObjectDeletion: Success`);
      return true;
    } catch (error) {
      this.loggerService.error(
        `ComsService: permanentObjectDeletion: Error: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Get file metadata from COMS
   * @param objectId The object ID
   * @returns File metadata
   */
  async getFileMetadata(objectId: string): Promise<any> {
    try {
      const response = await this.comsAxios.get(`/object/${objectId}/metadata`);
      return response.data;
    } catch (error) {
      this.loggerService.error(
        `ComsService: getFileMetadata: Error getting metadata: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to get file metadata',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Helper to set Content-Disposition header based on filename
   */
  private setDispositionHeader(filename: string): string {
    const encodedFilename = encodeURIComponent(filename);
    return `attachment; filename=${encodedFilename}; filename*=UTF-8''${encodedFilename}`;
  }
}
