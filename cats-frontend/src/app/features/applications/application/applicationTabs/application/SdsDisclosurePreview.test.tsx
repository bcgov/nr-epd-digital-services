import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SdsDisclosurePreview } from './SdsDisclosurePreview';
import {
  GetSdsDisclosurePreviewDocument,
  GetSdsDisclosurePreviewQuery,
} from './SdsDisclosurePreview.generated';

type Disclosure = NonNullable<
  GetSdsDisclosurePreviewQuery['getSdsDisclosurePreview']['data']
>;

const mappedDisclosure: Disclosure = {
  siteRegDateRecd: '2024-04-15',
  dateCompleted: '2024-05-01',
  localAuthDateRecd: '2024-04-15',
  rwmDateDecision: '2024-04-20',
  siteRegDateEntered: null,
  schedule2References: [
    { code: 'A1', description: 'Adhesives manufacturing or bulk storage' },
    { code: 'C3', description: 'Metal plating or finishing' },
  ],
  plannedActivityComment: 'Planned activity comment',
  siteDisclosureComment: 'Information used comment',
  govDocumentsComment: 'Government orders comment',
};

const renderPanel = (
  mocks: any[],
  props: Partial<ComponentProps<typeof SdsDisclosurePreview>> = {},
) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SdsDisclosurePreview applicationId={1} {...props} />
    </MockedProvider>,
  );

const successMock = (data: Disclosure | null) => ({
  request: {
    query: GetSdsDisclosurePreviewDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      getSdsDisclosurePreview: {
        message: 'Site disclosure preview retrieved successfully',
        httpStatusCode: 200,
        success: true,
        data,
      },
    },
  },
});

describe('SdsDisclosurePreview', () => {
  it('renders the SITE disclosure field set', async () => {
    renderPanel([successMock(mappedDisclosure)]);

    expect(
      await screen.findByText('Site Disclosure Statement'),
    ).toBeInTheDocument();
    expect(screen.getByText('Date Received')).toBeInTheDocument();
    expect(screen.getByText('Date Completed')).toBeInTheDocument();
    expect(screen.getByText('Local Authority Received')).toBeInTheDocument();
    expect(screen.getByText('Date Registrar Received')).toBeInTheDocument();
    expect(screen.getByText('Date Entered')).toBeInTheDocument();
  });

  it('renders the mapped dates, comments and Schedule 2 rows', async () => {
    renderPanel([successMock(mappedDisclosure)]);

    expect(
      await screen.findByTestId('sds-date-Date Completed'),
    ).toHaveTextContent('2024/05/01');
    expect(
      screen.getByTestId('sds-date-Local Authority Received'),
    ).toHaveTextContent('2024/04/15');
    expect(
      screen.getByTestId('sds-date-Date Registrar Received'),
    ).toHaveTextContent('2024/04/20');
    expect(
      screen.getByTestId(
        'sds-comment-List any past or present government orders, permits, approvals, certificates or notifications pertaining to the environmental condition of the site.',
      ),
    ).toHaveTextContent('Government orders comment');

    const table = screen.getByTestId('sds-schedule2');
    expect(table).toHaveTextContent('A1');
    expect(table).toHaveTextContent('Adhesives manufacturing or bulk storage');
    expect(table).toHaveTextContent('C3');
  });

  it('leaves missing dates blank', async () => {
    renderPanel([
      successMock({
        ...mappedDisclosure,
        dateCompleted: null,
        siteRegDateEntered: null,
      }),
    ]);

    expect(
      await screen.findByTestId('sds-date-Date Completed'),
    ).toBeEmptyDOMElement();
    expect(screen.getByTestId('sds-date-Date Entered')).toBeEmptyDOMElement();
  });

  it('shows no Schedule 2 rows when none are selected', async () => {
    renderPanel([
      successMock({ ...mappedDisclosure, schedule2References: [] }),
    ]);

    expect(
      await screen.findByTestId('sds-schedule2-empty'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('sds-schedule2')).not.toBeInTheDocument();
  });

  it('shows an error when the query fails', async () => {
    const errorMock = {
      request: {
        query: GetSdsDisclosurePreviewDocument,
        variables: { applicationId: 2 },
      },
      error: new Error('network error'),
    };

    renderPanel([errorMock], { applicationId: 2 });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Site disclosure preview could not be loaded.',
    );
  });

  it('shows the API message when the response is unsuccessful', async () => {
    const unsuccessfulMock = {
      request: {
        query: GetSdsDisclosurePreviewDocument,
        variables: { applicationId: 1 },
      },
      result: {
        data: {
          getSdsDisclosurePreview: {
            message:
              'The site disclosure preview is only available for Site Disclosure Statement applications',
            httpStatusCode: 400,
            success: false,
            data: null,
          },
        },
      },
    };

    renderPanel([unsuccessfulMock]);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The site disclosure preview is only available for Site Disclosure Statement applications',
    );
  });
});
