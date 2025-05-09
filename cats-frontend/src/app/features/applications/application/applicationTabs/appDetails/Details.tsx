import cx from 'classnames';
import { useParams } from 'react-router-dom';
import CollapsiblePanel from '../../../../../components/simple/CollapsiblePanel';
import { TickIcon } from '../../../../../components/common/icon';
import { formatDateUTC } from '../../../../../helpers/utility';

import { SiteDetails } from './components/SiteDetails';
import {
  useGetApplicationDetailsByIdQuery,
  useGetSiteDetailsBySiteIdQuery,
} from './Details.generated';
import styles from './Details.module.css';

interface IDetailsProps {
  applicationIdParam?: number;
}

export const Details: React.FC<IDetailsProps> = ({ applicationIdParam }) => {
  const { id = '' } = useParams();
  const applicationId =
    id === '' ? (applicationIdParam ?? NaN) : parseInt(id, 10);

  const { data, loading: applicationDataLoading } =
    useGetApplicationDetailsByIdQuery({
      variables: {
        applicationId,
      },
      skip: !applicationId,
    });

  const application = data?.getApplicationDetailsById.data;

  const {
    data: siteData,
    loading: siteDataLoading,
    called: siteDataCalled,
  } = useGetSiteDetailsBySiteIdQuery({
    variables: {
      siteId: application?.siteId?.toString() || '',
    },
    skip: !application?.siteId,
  });

  const site = siteData?.getSiteDetailsBySiteId.data;

  return (
    <div className="d-flex flex-column gap-3">
      <CollapsiblePanel
        defaultOpen={true}
        label="Application Information"
        loading={applicationDataLoading}
        defaultCloseBtnPosition="left"
        showBorder={applicationIdParam === undefined}
        showPadding={applicationIdParam === undefined}
        smallFont={!(applicationIdParam === undefined)}
        content={
          <div className={styles.rowsContainer}>
            <div className={cx(styles.row, styles.rowGrid6)}>
              <div className={styles.cell}>
                <label>Application ID</label>
                <div>{application?.id}</div>
              </div>
              <div className={styles.cell}>
                <label>CSAP Reference #</label>
                <div>{application?.csapRefNumber}</div>
              </div>
              <div className={styles.cell}>
                <label>Priority</label>
                <div>{application?.priority?.abbrev}</div>
              </div>
              <div className={styles.cell}>
                <label>Housing</label>
                <div>{application?.isHousing && <TickIcon />}</div>
              </div>
              <div className={styles.cell}>
                <label>Tax Exempt</label>
                <div>{application?.isTaxExempt && <TickIcon />}</div>
              </div>
            </div>

            <div className={cx(styles.row, styles.rowGrid6)}>
              <div className={styles.cell}>
                <label>Received</label>
                <div>
                  {application?.receivedDate
                    ? formatDateUTC(application?.receivedDate, 'E MMM d, yyyy')
                    : ''}
                </div>
              </div>
              <div className={styles.cell}>
                <label>Queued</label>
                <div>
                  {application?.queuedDate
                    ? formatDateUTC(application?.queuedDate, 'E MMM d, yyyy')
                    : ''}
                </div>
              </div>
              <div className={styles.cell}>
                <label>Completed</label>
                <div>
                  {application?.endDate
                    ? formatDateUTC(application?.endDate, 'E MMM d, yyyy')
                    : ''}
                </div>
              </div>
              <div className={styles.cell}>
                <label>Outcome</label>
                <div>{application?.outcome?.description}</div>
              </div>
            </div>

            <div className={cx(styles.row, styles.rowGrid2)}>
              <div className={styles.cell}>
                <label>Application Type</label>
                <div>{application?.appType?.description}</div>
              </div>
              <div className={styles.cell}>
                <label>Status</label>
                <div>{application?.currentStatus?.description}</div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.cell}>
                <label>Site Type</label>
                <div>{application?.siteType?.description}</div>
              </div>
              <div className={styles.cell}>
                <label>Review Process</label>
                <div>{application?.reviewProcess?.description}</div>
              </div>
            </div>
          </div>
        }
      />
      <SiteDetails
        primarySite={site}
        associatedSites={site?.associatedSites || []}
        loading={siteDataLoading || !siteDataCalled}
      />
    </div>
  );
};
