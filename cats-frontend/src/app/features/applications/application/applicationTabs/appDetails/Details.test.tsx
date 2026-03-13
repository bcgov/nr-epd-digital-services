import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { Details } from './Details';
import {
  GetApplicationDetailsByIdDocument,
  GetSiteDetailsBySiteIdDocument,
} from './Details.generated';
import {
  GetApplicationServiceTypesDocument,
  UpdateApplicationServiceTypeDocument,
  UpdateSecondaryServiceTypesDocument,
} from '../../../../assignment/graphql/assignment.generated';

const mockApplicationData = {
  request: {
    query: GetApplicationDetailsByIdDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      getApplicationDetailsById: {
        data: {
          id: 1,
          siteId: 100,
          csapRefNumber: 'CSR-001',
          priority: { abbrev: 'H' },
          isHousing: false,
          isTaxExempt: true,
          receivedDate: '2024-01-01',
          queuedDate: '2024-01-02',
          endDate: null,
          outcome: { description: 'Pending' },
          appType: { description: 'Contaminated Site Request' },
          currentStatus: { description: 'In Review' },
          siteType: { description: 'Residential' },
          reviewProcess: { description: 'Standard' },
          serviceTypeId: 5,
          secondaryServiceTypeIds: [],
        },
      },
    },
  },
};

const mockServiceTypesData = {
  request: {
    query: GetApplicationServiceTypesDocument,
  },
  result: {
    data: {
      getApplicationServiceTypes: {
        data: [
          { key: '1', value: 'Service Type 1' },
          { key: '5', value: 'Service Type 5' },
          { key: '10', value: 'Service Type 10' },
        ],
      },
    },
  },
};

const mockSiteData = {
  request: {
    query: GetSiteDetailsBySiteIdDocument,
    variables: { siteId: '100' },
  },
  result: {
    data: {
      getSiteDetailsBySiteId: {
        data: {
          id: 100,
          commonName: 'Test Site',
          addrLine_1: '123 Main St',
          city: 'Victoria',
          siteRiskCode: 'LOW',
        },
      },
    },
  },
};

const mockUpdateServiceType = {
  request: {
    query: UpdateApplicationServiceTypeDocument,
    variables: {
      applicationId: 1,
      serviceTypeId: 10,
    },
  },
  result: {
    data: {
      updateApplicationServiceType: {
        success: true,
        message: 'Application service type updated successfully',
        httpStatusCode: 200,
      },
    },
  },
};

const mockApplicationDataAfterUpdate = {
  request: {
    query: GetApplicationDetailsByIdDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      getApplicationDetailsById: {
        data: {
          ...mockApplicationData.result.data.getApplicationDetailsById.data,
          serviceTypeId: 10,
        },
      },
    },
  },
};

const mockClearServiceType = {
  request: {
    query: UpdateApplicationServiceTypeDocument,
    variables: {
      applicationId: 1,
      serviceTypeId: null,
    },
  },
  result: {
    data: {
      updateApplicationServiceType: {
        success: true,
        message: 'Application service type updated successfully',
        httpStatusCode: 200,
      },
    },
  },
};

const mockApplicationDataAfterClear = {
  request: {
    query: GetApplicationDetailsByIdDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      getApplicationDetailsById: {
        data: {
          ...mockApplicationData.result.data.getApplicationDetailsById.data,
          serviceTypeId: null,
        },
      },
    },
  },
};

describe('Details Component - Service Type Functionality', () => {
  it('should display the current service type', async () => {
    render(
      <MockedProvider
        mocks={[mockApplicationData, mockServiceTypesData, mockSiteData]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Service Type 5')).toBeInTheDocument();
    });
  });

  it('should show "Click to set CSSA service type" when no service type is set', async () => {
    const mockNoServiceType = {
      ...mockApplicationData,
      result: {
        data: {
          getApplicationDetailsById: {
            data: {
              ...mockApplicationData.result.data.getApplicationDetailsById.data,
              serviceTypeId: null,
              appType: { description: 'Contaminated Site Request' },
            },
          },
        },
      },
    };

    render(
      <MockedProvider
        mocks={[mockNoServiceType, mockServiceTypesData, mockSiteData]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Click to set CSSA service type'),
      ).toBeInTheDocument();
    });
  });

  it('should enter edit mode when clicking on service type', async () => {
    render(
      <MockedProvider
        mocks={[mockApplicationData, mockServiceTypesData, mockSiteData]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Service Type 5')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Service Type 5'));

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('should show Clear button when service type exists', async () => {
    render(
      <MockedProvider
        mocks={[mockApplicationData, mockServiceTypesData, mockSiteData]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Service Type 5')).toBeInTheDocument();
    });

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('should not show Clear button when no service type is set', async () => {
    const mockNoServiceType = {
      ...mockApplicationData,
      result: {
        data: {
          getApplicationDetailsById: {
            data: {
              ...mockApplicationData.result.data.getApplicationDetailsById.data,
              serviceTypeId: null,
              appType: { description: 'Contaminated Site Request' },
            },
          },
        },
      },
    };

    render(
      <MockedProvider
        mocks={[mockNoServiceType, mockServiceTypesData, mockSiteData]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Click to set CSSA service type'),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('should update service type when Save is clicked', async () => {
    render(
      <MockedProvider
        mocks={[
          mockApplicationData,
          mockServiceTypesData,
          mockSiteData,
          mockUpdateServiceType,
          mockApplicationDataAfterUpdate,
        ]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Service Type 5')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Service Type 5'));

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: '10' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Service Type 10')).toBeInTheDocument();
    });
  });

  it('should clear service type when Clear is clicked', async () => {
    render(
      <MockedProvider
        mocks={[
          mockApplicationData,
          mockServiceTypesData,
          mockSiteData,
          mockClearServiceType,
          mockApplicationDataAfterClear,
        ]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Service Type 5')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(
        screen.getByText('Click to set CSSA service type'),
      ).toBeInTheDocument();
    });
  });

  it('should cancel edit mode when Cancel is clicked', async () => {
    render(
      <MockedProvider
        mocks={[mockApplicationData, mockServiceTypesData, mockSiteData]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Service Type 5')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Service Type 5'));

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
      expect(screen.getByText('Service Type 5')).toBeInTheDocument();
    });
  });

  it('should disable Save button when no service type is selected', async () => {
    const mockNoServiceType = {
      ...mockApplicationData,
      result: {
        data: {
          getApplicationDetailsById: {
            data: {
              ...mockApplicationData.result.data.getApplicationDetailsById.data,
              serviceTypeId: null,
              appType: { description: 'Contaminated Site Request' },
            },
          },
        },
      },
    };

    render(
      <MockedProvider
        mocks={[mockNoServiceType, mockServiceTypesData, mockSiteData]}
        addTypename={false}
      >
        <MemoryRouter>
          <Details applicationIdParam={1} showSiteDetails={false} />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Click to set CSSA service type'),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Click to set CSSA service type'));

    await waitFor(() => {
      const saveButton = screen.getByText('Save');
      expect(saveButton).toBeDisabled();
    });
  });
});
