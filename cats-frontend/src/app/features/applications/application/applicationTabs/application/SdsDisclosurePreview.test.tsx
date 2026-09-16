import { ComponentProps } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SdsDisclosurePreview } from './SdsDisclosurePreview';
import {
  GetSdsDisclosurePreviewDocument,
  GetSdsDisclosurePreviewQuery,
} from './SdsDisclosurePreview.generated';
import { PushSiteDisclosureDocument } from './PushSiteDisclosure.generated';

type PreviewData = NonNullable<
  GetSdsDisclosurePreviewQuery['getSdsDisclosurePreview']['data']
>;
type Disclosure = NonNullable<PreviewData['disclosure']>;

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

const successMock = (data: PreviewData | null, applicationId = 1) => ({
  request: {
    query: GetSdsDisclosurePreviewDocument,
    variables: { applicationId },
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

const previewWithSite = (
  overrides: Partial<PreviewData> = {},
): PreviewData => ({
  disclosure: mappedDisclosure,
  siteId: 12345,
  lastPushedAt: null,
  ...overrides,
});

const pushMock = (payload: {
  success: boolean;
  message?: string;
  errorCode?: string | null;
  data?: { siteId?: number | null; lastPushedAt?: string | null } | null;
}) => ({
  request: {
    query: PushSiteDisclosureDocument,
    variables: { applicationId: 1 },
  },
  result: {
    data: {
      pushSiteDisclosure: {
        message: payload.message ?? 'Site disclosure pushed to Site Registry',
        httpStatusCode: payload.success ? 200 : 409,
        success: payload.success,
        errorCode: payload.errorCode ?? null,
        data: payload.data ?? null,
      },
    },
  },
});

describe('SdsDisclosurePreview', () => {
  it('renders the SITE disclosure field set', async () => {
    renderPanel([
      successMock({
        disclosure: mappedDisclosure,
        siteId: null,
        lastPushedAt: null,
      }),
    ]);

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
    renderPanel([successMock(previewWithSite())]);

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
      successMock(
        previewWithSite({
          disclosure: {
            ...mappedDisclosure,
            dateCompleted: null,
            siteRegDateEntered: null,
          },
        }),
      ),
    ]);

    expect(
      await screen.findByTestId('sds-date-Date Completed'),
    ).toBeEmptyDOMElement();
    expect(screen.getByTestId('sds-date-Date Entered')).toBeEmptyDOMElement();
  });

  it('shows no Schedule 2 rows when none are selected', async () => {
    renderPanel([
      successMock(
        previewWithSite({
          disclosure: { ...mappedDisclosure, schedule2References: [] },
        }),
      ),
    ]);

    expect(
      await screen.findByTestId('sds-schedule2-empty'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('sds-schedule2')).not.toBeInTheDocument();
  });

  it('disables Push with a visible reason until a Site ID is linked', async () => {
    renderPanel([
      successMock({
        disclosure: mappedDisclosure,
        siteId: null,
        lastPushedAt: null,
      }),
    ]);

    const pushButton = await screen.findByTestId('push-button');
    expect(pushButton).toBeDisabled();
    expect(screen.getByTestId('push-disabled-reason')).toHaveTextContent(
      'Link a Site ID before pushing this disclosure.',
    );
  });

  it('enables Push when a Site ID is linked', async () => {
    renderPanel([successMock(previewWithSite())]);

    expect(await screen.findByTestId('push-button')).toBeEnabled();
    expect(
      screen.queryByTestId('push-disabled-reason'),
    ).not.toBeInTheDocument();
  });

  it('disables Push when the linked site is cleared, even if the preview is stale', async () => {
    renderPanel([successMock(previewWithSite())], { linkedSiteId: null });

    expect(await screen.findByTestId('push-button')).toBeDisabled();
    expect(screen.getByTestId('push-disabled-reason')).toBeInTheDocument();
  });

  it('opens a modal with the same mapped disclosure and an always-add confirmation', async () => {
    renderPanel([successMock(previewWithSite())]);

    fireEvent.click(await screen.findByTestId('push-button'));

    expect(screen.getByTestId('push-confirmation')).toHaveTextContent(
      'add a new disclosure to Site ID 12345',
    );
    expect(screen.getAllByTestId('sds-schedule2')).toHaveLength(2);
  });

  it('cancel closes the modal without calling SITE', async () => {
    renderPanel([successMock(previewWithSite())]);

    fireEvent.click(await screen.findByTestId('push-button'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByTestId('push-confirmation')).not.toBeInTheDocument();
  });

  it('records the last push and offers a SITE disclosure link on success', async () => {
    renderPanel([
      successMock(previewWithSite()),
      pushMock({
        success: true,
        data: { siteId: 12345, lastPushedAt: '2024-06-01T18:30:00.000Z' },
      }),
    ]);

    fireEvent.click(await screen.findByTestId('push-button'));
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));

    expect(await screen.findByTestId('last-pushed')).toHaveTextContent(
      'Last pushed to Site ID 12345 on 2024/06/01 18:30',
    );
    expect(screen.getByTestId('site-disclosure-link')).toBeInTheDocument();
    expect(screen.queryByTestId('push-confirmation')).not.toBeInTheDocument();
  });

  it('shows the duplicate constraint distinctly and keeps the modal open', async () => {
    renderPanel([
      successMock(previewWithSite()),
      pushMock({
        success: false,
        errorCode: 'DUPLICATE_DATE_COMPLETED',
        message: 'A site disclosure already exists.',
      }),
    ]);

    fireEvent.click(await screen.findByTestId('push-button'));
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));

    expect(await screen.findByTestId('push-error')).toHaveTextContent(
      'already exists for this site with the same Date Completed',
    );
    expect(screen.getByTestId('push-confirmation')).toBeInTheDocument();
  });

  it('keeps other push failures retryable in the modal', async () => {
    renderPanel([
      successMock(previewWithSite()),
      pushMock({
        success: false,
        message: 'Schedule 2 reference is invalid',
      }),
    ]);

    fireEvent.click(await screen.findByTestId('push-button'));
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));

    expect(await screen.findByTestId('push-error')).toHaveTextContent(
      'Schedule 2 reference is invalid',
    );
    expect(screen.getByTestId('push-confirmation')).toBeInTheDocument();
  });

  it('shows the pushed site in the last-push line after the link is cleared', async () => {
    renderPanel([
      successMock({
        disclosure: mappedDisclosure,
        siteId: null,
        lastPushedSiteId: 100,
        lastPushedAt: '2026-09-16T23:27:00.000Z',
      }),
    ]);

    expect(await screen.findByTestId('last-pushed')).toHaveTextContent(
      'Last pushed to Site ID 100 on',
    );
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
