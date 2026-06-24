import { Injectable } from '@nestjs/common';
import axios from 'axios';
import ApplicationType from '../constants/applicationType';

/** Parse comma-separated numeric site IDs from form field values. */
export function parseNumericSiteIds(...values: unknown[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];

  for (const value of values) {
    if (value == null) {
      continue;
    }
    for (const part of String(value).split(',')) {
      const trimmed = part.trim();
      if (trimmed === '' || Number.isNaN(Number(trimmed))) {
        continue;
      }
      const num = Number(trimmed);
      if (!seen.has(num)) {
        seen.add(num);
        result.push(num);
      }
    }
  }

  return result;
}

/** NOM dataGrid may be a JSON string or array from CHEFS / Form.io. */
export function normalizeFormDataGrid(dataGrid: unknown): Record<string, unknown>[] {
  if (Array.isArray(dataGrid)) {
    return dataGrid.filter((row) => row && typeof row === 'object') as Record<
      string,
      unknown
    >[];
  }
  if (typeof dataGrid === 'string' && dataGrid.trim() !== '') {
    try {
      const parsed = JSON.parse(dataGrid);
      return Array.isArray(parsed)
        ? parsed.filter((row) => row && typeof row === 'object')
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Site IDs from live NOM CHEFS form fields (incl. S2-siteIdNumber + contact grid). */
export function getNomSiteIdsFromFormData(formData: Record<string, unknown>): number[] {
  const values: unknown[] = [
    formData.siteIdNumber,
    formData['S2-siteIdNumber'],
    formData['s2-siteIdNumber'],
  ];

  for (const row of normalizeFormDataGrid(formData.dataGrid)) {
    values.push(row.contactParcelSiteIdNumber);
    values.push(row['contact-parcelSiteIdNumber']);
  }

  return parseNumericSiteIds(...values);
}

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
          .map((id: string | undefined) => (id ? id.trim() : ''))
          .filter((id: string) => id !== '' && !isNaN(Number(id)))
          .map((id: string) => Number(id));
      case ApplicationType.DERA:
      case ApplicationType.NIR:
        return (
          formData.siteIdNumber
            ?.toString()
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean) // removes empty strings
            .map(Number)
            .filter((num) => !isNaN(num)) ?? // removes NaN
          []
        );
      case ApplicationType.NOM:
        return getNomSiteIdsFromFormData(formData);

      case ApplicationType.SRCR:
        return (
          formData.siteIdNumber
            ?.toString()
            .split(',')
            .map((id: string | undefined) => (id ? id.trim() : ''))
            .filter((id: string) => id !== '' && !isNaN(Number(id)))
            .map((id: string) => Number(id)) || []
        );

      case ApplicationType.SoSC:
        const soscSiteIds: number[] =
          formData.dataGrid
            ?.map((item: any) => Number(item.siteId))
            .filter((id: number) => !isNaN(id)) || [];

        return soscSiteIds;

      default:
        return (
          formData.siteId
            ?.toString()
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean) // removes empty strings
            .map(Number)
            .filter((num) => !isNaN(num)) ?? // removes NaN
          []
        );
    }
  };

  getApplicationSpecificData = (formData: any): Record<string, any> | null => {
    switch (formData.hdnAppType) {
      case ApplicationType.CSSA:
        return {
          serviceType: formData.Servicetype,
          siteRiskClassification:
            formData.siteRiskClassificationAtTimeOfApplication,
        };
      case ApplicationType.DERA:
        return {
          siteIdNumber: formData.siteRiskClassificationAtTimeOfApplication,
        };

      case ApplicationType.NOM:
        return {
          siteRiskClassification:
            formData.siteRiskClassificationAtTimeOfApplication,
        };

      case ApplicationType.NIR:
        return {
          siteRiskClassification:
            formData.siteRiskClassificationAtTimeOfApplication,
        };

      case ApplicationType.SRCR:
        return {
          siteRiskClassification: formData.siteRiskClassification,
        };

      default:
        return null;
    }
  };

  /**
   * To create a new application in CATS once a submission is received
   * @param formData
   * @param submissionId
   * @param formId
   * @returns application id in CATS
   */
  async submitToCats(
    formData: any,
    submissionId: string,
    formId: string,
  ): Promise<number | null> {
    const GRAPHQL_URL = process.env.CATS_API;

    if (!GRAPHQL_URL) {
      console.error('CATS_API is not configured');
      return null;
    }

    // Parse and split comma-separated site IDs
    const siteIds = this.getSiteIdsFromFormData(formData);

    // Get application-specific data
    const applicationSpecificData = this.getApplicationSpecificData(formData);

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
          applicationSpecificData: applicationSpecificData
            ? JSON.stringify(applicationSpecificData)
            : null, // JSON string
          applicationStatus: [
            {
              statusTypeAbbrev: 'New',
              isCurrent: true,
              applicationId: 0, // Will be overwritten by the backend
              formId: formId,
              submissionId: submissionId,
              formsflowAppId: Number(formData.applicationId) || 0,
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

      const created = response.data?.data?.createApplication?.data;
      const appId = Array.isArray(created)
        ? created[0]?.id ?? null
        : created?.id ?? null;
      return appId;
    } catch (error) {
      console.error('Error creating CATS application:', error);
      return null;
    }
  }

  /**
   * Links site ID(s) from form data to an existing CATS application (e.g. on re-ingest).
   */
  async syncApplicationSites(
    formData: Record<string, unknown>,
    submissionId: string,
    formId: string,
    statusTypeAbbrev = 'New',
  ): Promise<boolean> {
    const siteIds = this.getSiteIdsFromFormData(formData);
    if (siteIds.length === 0) {
      return false;
    }

    try {
      await this.updateCatsApplication(submissionId, formId, {
        ...formData,
        applicationStatus: statusTypeAbbrev,
        applicationId: Number(formData.applicationId) || 0,
      });
      return true;
    } catch (error) {
      console.error('Failed to sync site IDs to CATS application:', error);
      return false;
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

    if (!formData.applicationStatus) {
      console.log('No application status received');
      return;
    }

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
          formsflowAppId: Number(formData.applicationId) || 0,
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
