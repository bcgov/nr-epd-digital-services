import styles from './Details.module.css';
import cx from 'classnames';
import { useParams } from 'react-router-dom';
import CollapsiblePanel from '../../../../../components/simple/CollapsiblePanel';
import {
  useGetApplicationDetailsByIdQuery,
  useGetSiteDetailsBySiteIdQuery,
} from './Details.generated';
import { ExternalLink, TickIcon } from '../../../../../components/common/icon';
import { formatDateUTC } from '../../../../../helpers/utility';
import { formatCoordinate } from '../../../../../helpers/formatCoordinate/formatCoordinate';
import { Marker, TileLayer } from 'react-leaflet';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Icon } from 'leaflet';
import mapMarkerDefault from '../../../../../images/map_marker_default.png';
import { Button } from '../../../../../components/button/Button';

const mapMarkerIcon = new Icon({
  iconUrl: mapMarkerDefault,
  iconSize: [50, 65],
  iconAnchor: [25, 65],
});

export const Details = () => {
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

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

  const siteCoordinates = {
    lat: site?.latdeg || 0,
    lng: site?.longdeg || 0,
  };

  return (
    <div className="d-flex flex-column gap-3">
      <CollapsiblePanel
        defaultOpen={true}
        label="Application Information"
        loading={applicationDataLoading}
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
      <CollapsiblePanel
        label={
          <div className="d-flex gap-3 align-items-center">
            <span>Site Information</span>
            {application?.siteId && (
              <a
                href={`${import.meta.env.VITE_SITE_REGISTRY_URL}/site/details/${application?.siteId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex text-decoration-none"
              >
                <Button variant="secondary" size="small">
                  View on Site Registry <ExternalLink />
                </Button>
              </a>
            )}
          </div>
        }
        loading={siteDataLoading || !siteDataCalled}
        content={
          <div className={styles.siteInfoContainer}>
            {siteData && (
              <MapContainer
                center={siteCoordinates}
                zoom={14}
                zoomControl={false}
                className={styles.mapContainer}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={siteCoordinates} icon={mapMarkerIcon} />
              </MapContainer>
            )}

            <div className={styles.rowsContainer}>
              <div className={styles.row}>
                <div className={styles.cell}>
                  <label>Site ID</label>
                  <div>
                    <a
                      href={`${import.meta.env.VITE_SITE_REGISTRY_URL}/site/details/${site?.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.siteLink}
                    >
                      {site?.id} <ExternalLink />
                    </a>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.cell}>
                  <label>Latitude</label>
                  <div>{formatCoordinate(site?.latdeg)}</div>
                </div>
                <div className={styles.cell}>
                  <label>Longitude</label>
                  <div>{formatCoordinate(site?.longdeg)}</div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.cell}>
                  <label>Address</label>
                  <div>
                    {[
                      site?.addrLine_1,
                      site?.addrLine_2,
                      site?.addrLine_3,
                      site?.addrLine_4,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>
                <div className={styles.cell}>
                  <label>Region</label>
                  <div>{site?.city}</div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.cell}>
                  <label>Common Name</label>
                  <div>{site?.commonName}</div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.cell}>
                  <label>Site Risk Classification</label>
                  <div>{site?.siteRiskCode}</div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};
