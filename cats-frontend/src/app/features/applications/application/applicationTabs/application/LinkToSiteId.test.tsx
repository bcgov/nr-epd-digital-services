import { ComponentProps } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { LinkToSiteId } from './LinkToSiteId';
import { LinkApplicationSiteIdDocument } from './LinkToSiteId.generated';
import { GetHeaderDetailsByApplicationIdDocument } from '../../ApplicationDetails.generated';

const UNLINKED_MESSAGE =
  'Submission Address, PID, PIN not linked to any Site ID';

const headerMock = {
  request: {
    query: GetHeaderDetailsByApplicationIdDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      getApplicationDetailsById: {
        data: {
          id: 1,
          siteId: 12345,
          siteAddress: '123 Test St',
          siteCity: 'Victoria',
          appType: { abbrev: 'SDS', description: 'Site Disclosure Statement' },
        },
      },
    },
  },
};

const renderPanel = (
  mocks: any[],
  props: Partial<ComponentProps<typeof LinkToSiteId>> = {},
) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <LinkToSiteId applicationId={1} {...props} />
    </MockedProvider>,
  );

describe('LinkToSiteId', () => {
  it('shows the unlinked notice, a numeric text field and a Link action', () => {
    renderPanel([]);

    expect(screen.getByText(UNLINKED_MESSAGE)).toBeInTheDocument();
    const input = screen.getByLabelText('Link to Site ID') as HTMLInputElement;
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument();
  });

  it('rejects non-numeric input locally without calling the API', async () => {
    renderPanel([]);

    fireEvent.change(screen.getByLabelText('Link to Site ID'), {
      target: { value: '12a' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Site ID must be a number',
    );
  });

  it('rejects an out-of-range Site ID locally without calling the API', async () => {
    renderPanel([]);

    fireEvent.change(screen.getByLabelText('Link to Site ID'), {
      target: { value: '2147483648' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Site ID is out of range',
    );
  });

  it('links a valid Site ID and shows the SITE address', async () => {
    const mutationMock = {
      request: {
        query: LinkApplicationSiteIdDocument,
        variables: { applicationId: 1, siteId: '12345' },
      },
      result: {
        data: {
          linkApplicationSiteId: {
            message: 'Site ID linked successfully',
            httpStatusCode: 200,
            success: true,
            data: {
              siteId: 12345,
              siteAddress: '123 Test St',
              siteCity: 'Victoria',
            },
          },
        },
      },
    };

    renderPanel([mutationMock, headerMock]);

    fireEvent.change(screen.getByLabelText('Link to Site ID'), {
      target: { value: '12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));

    expect(await screen.findByTestId('site-id-current')).toHaveTextContent(
      'Linked to Site ID 12345 — 123 Test St, Victoria',
    );
    expect(screen.queryByText(UNLINKED_MESSAGE)).not.toBeInTheDocument();
  });

  it('shows an error and keeps the stored Site ID when SITE does not have the site', async () => {
    const mutationMock = {
      request: {
        query: LinkApplicationSiteIdDocument,
        variables: { applicationId: 1, siteId: '99999' },
      },
      result: {
        data: {
          linkApplicationSiteId: {
            message: 'Site ID was not found in Site Registry',
            httpStatusCode: 404,
            success: false,
            data: null,
          },
        },
      },
    };

    renderPanel([mutationMock, headerMock], { linkedSiteId: 12345 });

    fireEvent.change(screen.getByLabelText('Link to Site ID'), {
      target: { value: '99999' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Site ID was not found in Site Registry',
    );
    expect(screen.getByTestId('site-id-current')).toHaveTextContent(
      'Linked to Site ID 12345',
    );
  });

  it('unlinks when the field is cleared and saved', async () => {
    const mutationMock = {
      request: {
        query: LinkApplicationSiteIdDocument,
        variables: { applicationId: 1, siteId: '' },
      },
      result: {
        data: {
          linkApplicationSiteId: {
            message: 'Site ID unlinked successfully',
            httpStatusCode: 200,
            success: true,
            data: { siteId: null, siteAddress: null, siteCity: null },
          },
        },
      },
    };

    renderPanel([mutationMock, headerMock], { linkedSiteId: 12345 });

    fireEvent.change(screen.getByLabelText('Link to Site ID'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(UNLINKED_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByTestId('site-id-current')).not.toBeInTheDocument();
  });

  it('shows the current SITE location when a site is already linked', () => {
    renderPanel([], {
      linkedSiteId: 12345,
      linkedSiteAddress: '123 Test St',
      linkedSiteCity: 'Victoria',
    });

    expect(screen.getByTestId('site-id-current')).toHaveTextContent(
      'Linked to Site ID 12345 — 123 Test St, Victoria',
    );
    expect(screen.queryByText(UNLINKED_MESSAGE)).not.toBeInTheDocument();
  });

  it('asks for confirmation before changing the Site ID after a push', async () => {
    const mutationMock = {
      request: {
        query: LinkApplicationSiteIdDocument,
        variables: { applicationId: 1, siteId: '54321' },
      },
      result: {
        data: {
          linkApplicationSiteId: {
            message: 'Site ID linked successfully',
            httpStatusCode: 200,
            success: true,
            data: {
              siteId: 54321,
              siteAddress: '500 New St',
              siteCity: 'Vancouver',
            },
          },
        },
      },
    };

    renderPanel([mutationMock, headerMock], {
      linkedSiteId: 12345,
      hasBeenPushed: true,
    });

    fireEvent.change(screen.getByLabelText('Link to Site ID'), {
      target: { value: '54321' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByTestId('change-site-confirmation'),
    ).toHaveTextContent('stay on the previously linked site');

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() =>
      expect(screen.getByTestId('site-id-current')).toHaveTextContent(
        'Linked to Site ID 54321',
      ),
    );
  });

  it('does not change the Site ID when the change confirmation is cancelled', async () => {
    const mutationMock = {
      request: {
        query: LinkApplicationSiteIdDocument,
        variables: { applicationId: 1, siteId: '54321' },
      },
      result: {
        data: {
          linkApplicationSiteId: {
            message: 'Site ID linked successfully',
            httpStatusCode: 200,
            success: true,
            data: {
              siteId: 54321,
              siteAddress: '500 New St',
              siteCity: 'Vancouver',
            },
          },
        },
      },
    };

    renderPanel([mutationMock, headerMock], {
      linkedSiteId: 12345,
      hasBeenPushed: true,
    });

    fireEvent.change(screen.getByLabelText('Link to Site ID'), {
      target: { value: '54321' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));

    expect(screen.getByTestId('site-id-current')).toHaveTextContent(
      'Linked to Site ID 12345',
    );
  });
});
