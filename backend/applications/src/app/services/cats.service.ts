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
   * @param savedSubmission saved form
   * @returns saved form in formflow expected format
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

        console.log(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Site Id not available, application not created in CATS for formID:' + formId + ' submissionId:' + submissionId);
    }

  }
}
