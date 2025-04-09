import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { In, Repository } from 'typeorm';

import { HousingApplicationXref } from '../../entities/housingApplicationXref.entity';
import { ApplicationHousingDto } from '../../dto/applicationHousing.dto';
import { Housing } from '../../entities/housing.entity';
import { YesNoCode } from '../../entities/yesNoCode.entity';
import { Application } from '../../entities/application.entity';
import {
  AddHousingInputDto,
  UpdateHousingInputDto,
} from '../../dto/applicationHousing.dto';
import { HousingType } from '../../entities/housingType.entity';
import { HousingTypeDto } from '../../dto/housingType.dto';
import { LoggerService } from '../../logger/logger.service';
@Injectable()
export class ApplicationHousingService {
  constructor(
    @InjectRepository(HousingApplicationXref)
    private readonly applicationHousingRepository: Repository<HousingApplicationXref>,
    @InjectRepository(Housing)
    private readonly housingRepository: Repository<Housing>,
    @InjectRepository(YesNoCode)
    private readonly yesNoRepository: Repository<YesNoCode>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(HousingType)
    private readonly housingTypeRepository: Repository<HousingType>,
    private readonly loggerService: LoggerService,
  ) { }

  async getApplicationHousingByApplicationId(
    applicationId: number,
  ): Promise<ApplicationHousingDto[]> {
    try {
      const result = await this.applicationHousingRepository.find({
        where: {
          application: {
            id: applicationId,
          },
        },
        relations: {
          housing: {
            isRental: true,
            isSocial: true,
            isIndigenousLed: true,
            housingType: true,
            housingApplicationXrefs: {
              application: true,
            },
          },
        },
      });

      const transfrormedResult = result.map((record) => {
        return {
          ...record,
          housing: {
            ...record.housing,
            relatedApplications: record?.housing?.housingApplicationXrefs
              .map((xref) => xref.application.id)
              .filter((id) => id !== applicationId), // filter out the applications with the same ID as in the query
          },
        };
      });

      return plainToInstance(ApplicationHousingDto, transfrormedResult);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Helper method to get Yes/No code entities
   * @returns Object containing yes and no code entities
   * @throws HttpException if codes are not found
   */
  private async getYesNoCodes(): Promise<{
    yesCode: YesNoCode;
    noCode: YesNoCode;
  }> {
    const yesCode = await this.yesNoRepository.findOne({
      where: { abbrev: 'Y' },
    });
    const noCode = await this.yesNoRepository.findOne({
      where: { abbrev: 'N' },
    });

    if (!yesCode || !noCode) {
      throw new HttpException('Yes/No codes not found', HttpStatus.BAD_REQUEST);
    }

    return { yesCode, noCode };
  }

  async addHousingToApplication(
    input: AddHousingInputDto,
    user: any,
  ): Promise<ApplicationHousingDto[]> {
    try {
      const {
        applicationId,
        housingTypeId,
        numberOfUnits,
        effectiveDate,
        expiryDate,
        isRental,
        isSocial,
        isIndigenousLed,
        relatedApplicationIds,
      } = input;

      const validationErrors = [];

      if (!applicationId) {
        validationErrors.push('Application ID is required');
      }

      if (!housingTypeId) {
        validationErrors.push('Housing Type ID is required');
      }

      if (!numberOfUnits || numberOfUnits <= 0) {
        validationErrors.push('Number of units must be a positive number');
      }

      if (!effectiveDate) {
        validationErrors.push('Effective date is required');
      }

      if (validationErrors.length > 0) {
        throw new HttpException(
          { message: 'Validation failed', errors: validationErrors },
          HttpStatus.BAD_REQUEST,
        );
      }

      const currentUser = user?.name || 'N/A';
      const currentDateTime = new Date();

      const { yesCode, noCode } = await this.getYesNoCodes();

      const application = await this.applicationRepository.findOne({
        where: { id: applicationId },
      });

      if (!application) {
        throw new HttpException(
          `Application with ID ${applicationId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const newHousing = this.housingRepository.create({
        numberOfUnits,
        effectiveDate,
        expiryDate,
        displayOrder: 0,
        rowVersionCount: 0,
        createdBy: currentUser,
        createdDateTime: currentDateTime,
        updatedBy: currentUser,
        updatedDateTime: currentDateTime,
        housingType: { id: housingTypeId },
        isRental: isRental ? yesCode : noCode,
        isSocial: isSocial ? yesCode : noCode,
        isIndigenousLed: isIndigenousLed ? yesCode : noCode,
        ts: Buffer.from(''),
      });
      const savedHousing = await this.housingRepository.save(newHousing);

      const housingApplicationXref = this.applicationHousingRepository.create({
        housing: savedHousing,
        application,
        createdBy: currentUser,
        createdDateTime: currentDateTime,
        updatedBy: currentUser,
        updatedDateTime: currentDateTime,
        ts: Buffer.from(''),
      });
      await this.applicationHousingRepository.save(housingApplicationXref);

      if (relatedApplicationIds && relatedApplicationIds.length > 0) {
        const relatedApplications = await this.applicationRepository.find({
          where: { id: In(relatedApplicationIds) },
        });

        const relatedXrefs = relatedApplications.map((relatedApp) =>
          this.applicationHousingRepository.create({
            housing: savedHousing,
            application: relatedApp,
            createdBy: currentUser,
            createdDateTime: currentDateTime,
            updatedBy: currentUser,
            updatedDateTime: currentDateTime,
            ts: Buffer.from(''),
          }),
        );

        await this.applicationHousingRepository.save(relatedXrefs);
      }

      return this.getApplicationHousingByApplicationId(applicationId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to add housing to application',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateApplicationHousing(
    input: UpdateHousingInputDto,
    user: any,
  ): Promise<ApplicationHousingDto[]> {
    try {
      const {
        applicationHousingId,
        housingTypeId,
        numberOfUnits,
        effectiveDate,
        expiryDate,
        isRental,
        isSocial,
        isIndigenousLed,
        relatedApplicationIds,
      } = input;

      const validationErrors = [];
      if (!applicationHousingId) {
        validationErrors.push('Application Housing ID is required');
      }

      if (validationErrors.length > 0) {
        throw new HttpException(
          { message: 'Validation failed', errors: validationErrors },
          HttpStatus.BAD_REQUEST,
        );
      }

      const housingApplicationXref =
        await this.applicationHousingRepository.findOne({
          where: { id: applicationHousingId },
          relations: {
            housing: {
              housingType: true,
              isRental: true,
              isSocial: true,
              isIndigenousLed: true,
            },
            application: true,
          },
        });

      if (!housingApplicationXref) {
        throw new HttpException(
          `Housing application record with ID ${applicationHousingId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const existingHousing = housingApplicationXref.housing;
      const applicationId = housingApplicationXref.application.id;
      const currentUser = user?.name || 'SYSTEM';
      const currentDateTime = new Date();

      const { yesCode, noCode } = await this.getYesNoCodes();

      // Update housing properties
      if (housingTypeId) {
        existingHousing.housingType = { id: housingTypeId } as any;
      }
      if (numberOfUnits !== undefined) {
        existingHousing.numberOfUnits = numberOfUnits;
      }
      if (effectiveDate) {
        existingHousing.effectiveDate = effectiveDate;
      }
      if (expiryDate !== undefined) {
        existingHousing.expiryDate = expiryDate;
      }
      if (isRental !== undefined) {
        existingHousing.isRental = isRental ? yesCode : noCode;
      }
      if (isSocial !== undefined) {
        existingHousing.isSocial = isSocial ? yesCode : noCode;
      }
      if (isIndigenousLed !== undefined) {
        existingHousing.isIndigenousLed = isIndigenousLed ? yesCode : noCode;
      }

      existingHousing.updatedBy = currentUser;
      existingHousing.updatedDateTime = currentDateTime;

      await this.housingRepository.save(existingHousing);

      if (relatedApplicationIds) {
        const existingRelatedXrefs =
          await this.applicationHousingRepository.find({
            where: {
              housing: { id: existingHousing.id },
            },
            relations: {
              application: true,
            },
          });

        const existingRelatedAppIds = existingRelatedXrefs
          .map((xref) => xref.application.id)
          .filter((id) => id !== applicationId); // Exclude the main application

        // Find applications to add (those in relatedApplicationIds but not in existingRelatedAppIds)
        const applicationsToAdd = relatedApplicationIds.filter(
          (id) => !existingRelatedAppIds.includes(id) && id !== applicationId,
        );

        // Find applications to remove (those in existingRelatedAppIds but not in relatedApplicationIds)
        const applicationsToRemove = existingRelatedAppIds.filter(
          (id) => !relatedApplicationIds.includes(id),
        );

        // Add new related applications
        if (applicationsToAdd.length > 0) {
          const applications = await this.applicationRepository.find({
            where: { id: In(applicationsToAdd) },
          });

          const newXrefs = applications.map((app) =>
            this.applicationHousingRepository.create({
              housing: existingHousing,
              application: app,
              createdBy: currentUser,
              createdDateTime: currentDateTime,
              updatedBy: currentUser,
              updatedDateTime: currentDateTime,
              ts: Buffer.from(''),
            }),
          );

          await this.applicationHousingRepository.save(newXrefs);
        }

        // Remove applications that are no longer related
        if (applicationsToRemove.length > 0) {
          const xrefsToRemove = existingRelatedXrefs.filter((xref) =>
            applicationsToRemove.includes(xref.application.id),
          );

          await this.applicationHousingRepository.remove(xrefsToRemove);
        }
      }

      return this.getApplicationHousingByApplicationId(applicationId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update housing',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getHousingTypes(): Promise<HousingTypeDto[]> {
    this.loggerService.log(
      `ApplicationHousingService.getHousingTypes: Getting housing types.`,
    );
    const housingTypes = await this.housingTypeRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });

    this.loggerService.log(
      `ApplicationHousingService.getHousingTypes: ${housingTypes.length} housing types found.`,
    );

    return plainToInstance(HousingTypeDto, housingTypes);
  }
}
