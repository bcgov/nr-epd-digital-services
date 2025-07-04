import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import axios from 'axios';

@Injectable()
export class CatsService {
  constructor() {

  }

  /**
   * To create a new application in CATS once a submission is received
   * @param formData
   * @param submissionId
   * @param formId
   * @returns application id in CATS
   */
  async submitToCats(formData: any, submissionId: string, formId: string) {
    const GRAPHQL_URL = process.env.CATS_API;

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
          siteId: Number(formData.siteId),            // Float!          
          appTypeAbbrev: formData.hdnAppType,           // String!
          receivedDate: new Date(),
          applicationStatus: [
            {
              statusTypeAbbrev: 'New',
              isCurrent: true,
              applicationId: 0,// Will be overwritten by the backend
              formId: formId,
              submissionId: submissionId,
              formsflowAppId: Number(formData.applicationId),            // Float!
            }
          ]
        }
      }
    };

    if (formData.siteId) {
      try {
        const response = await axios.post(GRAPHQL_URL, createApplicationMutation, {
          headers: {
            "Content-Type": "application/json"
          }
        });

      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Site Id not available, application not created in CATS for formID:' + formId + ' submissionId:' + submissionId);
    }

  }

  /**
   * To create the formsflow application id in CATS database
   * @param submissionId saved form
   * @param formId saved form
   * @returns id, submissionId, formId
   */
  async updateCatsApplication(submissionId: string, formId: string, formData: any) {
    const GRAPHQL_URL = process.env.CATS_API;

    console.log('formData---');
    console.log(formData);
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
        }
      },
    };

    try {
      const response = await axios.post(GRAPHQL_URL, updateApplicationMutation, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating application in CATS:', error);
      throw error;
    }
  }

}
