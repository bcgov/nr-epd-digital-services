import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { Coms } from '../../dto/coms/coms.dto';
import { ComsResponse } from '../../dto/response/coms/comsResponse';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { LoggerService } from '../../logger/logger.service';
import { ComsService } from '../../services/coms/coms.service';
import { DownloadType } from '../../utilities/enums/coms/downloadType.enum';

@Resolver()
export class ComsResolver {
  constructor(
    private readonly comsService: ComsService,
    private readonly loggerService: LoggerService,
    private readonly comsResponse: GenericResponseProvider<Coms>,
  ) {}

  @Mutation(() => ComsResponse, { name: 'createBucket' })
  async createBucket(
    @Args('bucketName', { type: () => String }) bucketName: string,
    @Args('bucketKey', { type: () => String }) bucketKey: string,
    @Context() context: any,
  ) {
    try {
      this.loggerService.log(
        `InvoiceResolver: createBucket: bucketName: ${bucketName}, bucketKey: ${bucketKey}`,
      );
      const result = await this.comsService.createBucket(
        bucketName,
        bucketKey,
        context,
      );
      if (result) {
        return this.comsResponse.createResponse(
          'Bucket created successfully',
          HttpStatus.OK,
          true,
          result,
        );
      } else {
        return this.comsResponse.createResponse(
          'Failed to create bucket',
          HttpStatus.INTERNAL_SERVER_ERROR,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: createBucket: Error creating bucket: ${error.message}`,
        null,
      );
    }
  }

  @Mutation(() => ComsResponse, { name: 'deleteBucket' })
  async deleteBucket(
    @Args('bucketId', { type: () => String }) bucketId: string,
    @Context() context: any,
  ) {
    try {
      this.loggerService.log(
        `InvoiceResolver: deleteBucket: bucketName: ${bucketId}`,
      );
      const result = await this.comsService.deleteBucket(bucketId, context);
      if (result) {
        return this.comsResponse.createResponse(
          'Bucket deleted successfully',
          HttpStatus.OK,
          true,
          null,
        );
      } else {
        return this.comsResponse.createResponse(
          'Failed to delete bucket',
          HttpStatus.INTERNAL_SERVER_ERROR,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: deleteBucket: Error deleting bucket: ${error.message}`,
        null,
      );
    }
  }

  @Query(() => ComsResponse, { name: 'getObject' })
  async getObject(
    @Args('objectId', { type: () => String }) objectId: string,
    @Args('downloadType', {
      type: () => DownloadType,
      defaultValue: DownloadType.URL,
    })
    downloadType: DownloadType = DownloadType.URL,
    @Context() context: any,
  ) {
    try {
      this.loggerService.log(
        `InvoiceResolver: getObject: objectId: ${objectId}`,
      );
      const result = await this.comsService.getObject(
        objectId,
        downloadType,
        context,
      );
      if (result) {
        return this.comsResponse.createResponse(
          'Object fetched successfully',
          HttpStatus.OK,
          true,
          result,
        );
      } else {
        return this.comsResponse.createResponse(
          'Failed to fetch object',
          HttpStatus.INTERNAL_SERVER_ERROR,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: getObject: Error fetching object: ${error.message}`,
        null,
      );
    }
  }

  @Mutation(() => ComsResponse, { name: 'deleteObject' })
  async deleteObject(
    @Args('objectId', { type: () => String }) objectId: string,
    @Context() context: any,
    @Args('versionId', { type: () => String, nullable: true })
    versionId?: string,
  ) {
    try {
      this.loggerService.log(
        `InvoiceResolver: deleteObject: objectId: ${objectId}`,
      );
      const result = await this.comsService.deleteObject(
        objectId,
        context,
        versionId,
      );
      if (result) {
        return this.comsResponse.createResponse(
          'Object deleted successfully',
          HttpStatus.OK,
          true,
          null,
        );
      } else {
        return this.comsResponse.createResponse(
          'Failed to delete object',
          HttpStatus.INTERNAL_SERVER_ERROR,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `InvoiceResolver: deleteObject: Error deleting object: ${error.message}`,
        null,
      );
    }
  }
}
