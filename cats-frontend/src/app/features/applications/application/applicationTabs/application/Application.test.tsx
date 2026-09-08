import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Application } from './Application';
import {
  GetApplicationByIdDocument,
  GetApplicationStatusTypesDocument,
  GetSubmissionByApplicationIdDocument,
  UpdateApplicationStatusDocument,
} from './Application.generated';

vi.mock('@formio/react', () => ({
  Form: () => <div data-testid="readonly-form">form</div>,
}));

vi.mock('formiojs/dist/formio.full.min.css', () => ({}));

vi.mock(
  '../../../../../../../common-hosted-form-service/components/lib/use',
  () => ({}),
);

const submissionMock = {
  request: {
    query: GetSubmissionByApplicationIdDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      getSubmissionByApplicationId: {
        message: 'ok',
        httpStatusCode: 200,
        success: true,
        data: {
          id: 'sub-1',
          applicationId: 1,
          chefsFormId: 'form-1',
          chefsSubmissionId: '1234567654212345665432',
          chefsConfirmationId: null,
          linkedConfirmationIds: null,
          formData: JSON.stringify({ owner: 'Corp' }),
          formSchema: JSON.stringify({
            schema: {
              title: 'Notice of Likely or Actual Migration',
              components: [{ type: 'textfield', key: 'owner' }],
            },
          }),
          receivedAt: '2024-01-15',
        },
      },
    },
  },
};

const applicationStatusMock = {
  request: {
    query: GetApplicationByIdDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      getApplicationDetailsById: {
        data: {
          id: 1,
          formId: 'form-1',
          submissionId: 'sub-1',
          receivedDate: '2024-01-15',
          currentStatus: { id: 2, description: 'In Review' },
        },
      },
    },
  },
};

const statusTypesMock = {
  request: {
    query: GetApplicationStatusTypesDocument,
  },
  result: {
    data: {
      getAllStatusTypes: [
        { id: 2, description: 'In Review' },
        { id: 4, description: 'Approved' },
      ],
    },
  },
};

const renderApplication = (mocks: unknown[]) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={['/applications/1/application']}>
        <Routes>
          <Route path="/applications/:id/application" element={<Application />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );

describe('Application tab status', () => {
  it('renders received date and current status above the form', async () => {
    renderApplication([
      submissionMock,
      applicationStatusMock,
      statusTypesMock,
    ]);

    await waitFor(() => {
      expect(
        screen.getByText('Application Received: 2024/01/15'),
      ).toBeInTheDocument();
      expect(screen.getByText('Status:')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    expect(statusSelect).toHaveValue('2');
    expect(statusSelect).toHaveDisplayValue('In Review');
    expect(
      screen.getByRole('option', { name: 'Select Status' }),
    ).toBeInTheDocument();

    const originalSubmissionLink = screen.getByRole('link', {
      name: 'submit.digital.gov.bc.ca/app/form/view?s=1234567654212345665432',
    });
    expect(originalSubmissionLink).toHaveAttribute(
      'href',
      'https://submit.digital.gov.bc.ca/app/form/view?s=1234567654212345665432',
    );
    expect(originalSubmissionLink).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('readonly-form')).toBeInTheDocument();
  });

  it('updates application status when a new value is selected', async () => {
    const updateMock = {
      request: {
        query: UpdateApplicationStatusDocument,
        variables: { applicationId: 1, statusTypeId: 4 },
      },
      result: {
        data: {
          updateApplicationStatus: {
            message: 'Application status updated successfully',
            httpStatusCode: 200,
            success: true,
          },
        },
      },
    };

    const applicationStatusAfterUpdate = {
      ...applicationStatusMock,
      result: {
        data: {
          getApplicationDetailsById: {
            data: {
              ...applicationStatusMock.result.data.getApplicationDetailsById
                .data,
              currentStatus: { id: 4, description: 'Approved' },
            },
          },
        },
      },
    };

    renderApplication([
      submissionMock,
      applicationStatusMock,
      statusTypesMock,
      updateMock,
      applicationStatusAfterUpdate,
      applicationStatusAfterUpdate,
    ]);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('2');
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '4' } });

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('4');
    });
  });

  it('shows Select Status when the application has no saved status', async () => {
    const noStatusMock = {
      ...applicationStatusMock,
      result: {
        data: {
          getApplicationDetailsById: {
            data: {
              ...applicationStatusMock.result.data.getApplicationDetailsById
                .data,
              currentStatus: null,
            },
          },
        },
      },
    };

    renderApplication([submissionMock, noStatusMock, statusTypesMock]);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveDisplayValue('Select Status');
    });
  });

  it('allows selecting Select Status again after a status is chosen', async () => {
    const updateMock = {
      request: {
        query: UpdateApplicationStatusDocument,
        variables: { applicationId: 1, statusTypeId: 4 },
      },
      result: {
        data: {
          updateApplicationStatus: {
            message: 'Application status updated successfully',
            httpStatusCode: 200,
            success: true,
          },
        },
      },
    };

    renderApplication([
      submissionMock,
      applicationStatusMock,
      statusTypesMock,
      updateMock,
    ]);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('2');
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '4' } });

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('4');
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveDisplayValue('Select Status');
    });
  });
});
