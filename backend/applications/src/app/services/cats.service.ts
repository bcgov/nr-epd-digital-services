import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import axios from 'axios';
import ApplicationType from '../constants/applicationType';

@Injectable()
export class CatsService {
  constructor() {}

  getSiteIdsFromFormData = (formData: any) => {
    switch (formData.hdnAppType) {
      case ApplicationType.SIR:
        // SIR form has 2 fields
        const combinedSiteIds = [
          ...(formData.siteSpecificSiteId?.toString()?.split(',') || []),
          ...(formData.documentsSiteId?.toString()?.split(',') || []),
        ];
        return combinedSiteIds
          .map((id: string) => id.trim())
          .filter((id: string) => id !== '')
          .map(Number);
      case ApplicationType.DERA:
      case ApplicationType.NIR:
        return (
          formData.siteIdNumber?.toString()
            .split(',')
            .map(id => id.trim())
            .filter(Boolean) // removes empty strings
            .map(Number)
            .filter(num => !isNaN(num)) // removes NaN
          ?? []
        );
      case ApplicationType.NOM:
        const nomSiteIds = [
          ...(formData.dataGrid?.flatMap((item: any) =>
            item['contactParcelSiteIdNumber']?.toString().split(','),
          ) || []),
          ...(formData.siteIdNumber?.toString().split(',') || []),
        ];

        return nomSiteIds
          .map((id: string) => id.trim())
          .filter((id: string) => id !== '')
          .map(Number);
      case ApplicationType.SRCR:
        return (
          formData.siteIdNumber
            ?.toString()
            .split(',')
            .map((id: string) => id.trim())
            .filter((id: string) => id !== '')
            .map(Number) || []
        );
      default:
        return (
          formData.siteId?.toString()
            .split(',')
            .map(id => id.trim())
            .filter(Boolean) // removes empty strings
            .map(Number)
            .filter(num => !isNaN(num)) // removes NaN
          ?? []
        );
    }
  };

  /**
   * To create a new application in CATS once a submission is received
   * @param formData
   * @param submissionId
   * @param formId
   * @returns application id in CATS
   */
  async submitToCats(formData: any, submissionId: string, formId: string) {
    const GRAPHQL_URL = process.env.CATS_API;

    // Parse and split comma-separated site IDs
    const siteIds = this.getSiteIdsFromFormData(formData);

    const createApplicationMutation = {
      query: `
    mutation CreateNewApplication($application: CreateApplication!) {
      createApplication(application: $application) {
        message
        httpStatusCode
        success
        timestamp
        data {
          id
        }
      }
    }
  `,
      variables: {
        application: {
          siteIds: siteIds, // array of site id's
          appTypeAbbrev: formData.hdnAppType, // String!
          receivedDate: new Date(),
          applicationStatus: [
            {
              statusTypeAbbrev: 'New',
              isCurrent: true,
              applicationId: 0, // Will be overwritten by the backend
              formId: formId,
              submissionId: submissionId,
              formsflowAppId: Number(formData.applicationId), // Float!
            },
          ],
        },
      },
    };

    try {
      const response = await axios.post(
        GRAPHQL_URL,
        createApplicationMutation,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * To create the formsflow application id in CATS database
   * @param submissionId saved form
   * @param formId saved form
   * @returns id, submissionId, formId
   */
  async updateCatsApplication(
    submissionId: string,
    formId: string,
    formData: any,
  ) {
    if (!formData.applicationStatus) {
      console.log('No application status received');
      return;
    }

    const GRAPHQL_URL = process.env.CATS_API;

    // Parse and split comma-separated site IDs
    const siteIds = this.getSiteIdsFromFormData(formData);

    const updateApplicationMutation = {
      query: `
        mutation UpdateFormsflowAppId($appStatusInput: UpdateApplicationStatusDto!) {
          updateFormsflowAppId(appStatusInput: $appStatusInput) {
            message
            httpStatusCode
            success
            timestamp
            data {
              formsflowAppId
            }
          }
        }
      `,
      variables: {
        appStatusInput: {
          submissionId: submissionId,
          formId: formId,
          formsflowAppId: Number(formData.applicationId),
          statusTypeAbbrev: formData.applicationStatus,
          siteIds: siteIds, // array of site id's
        },
      },
    };

    try {
      const response = await axios.post(
        GRAPHQL_URL,
        updateApplicationMutation,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error updating application in CATS:', error);
      throw error;
    }
  }
}
