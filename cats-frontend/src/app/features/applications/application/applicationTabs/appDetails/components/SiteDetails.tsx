import { useState } from 'react';
import cx from 'classnames';
import { Icon } from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { TableColumn } from '@cats/components/table/TableColumn';
import { FormFieldType } from '@cats/components/input-controls/IFormField';
import { ColumnSize } from '@cats/components/table/TableColumn';
import { formatDateUTC } from '@cats/helpers/utility';
import { ExternalLink } from '@cats/components/common/icon';
import CollapsiblePanel from '@cats/components/simple/CollapsiblePanel';
import Widget from '@cats/components/widget/Widget';
import { Button } from '@cats/components/button/Button';
import { RequestStatus } from '@cats/helpers/requests/status';
import mapMarkerDefault from '@cats/images/map_marker_default.png';
import { formatCoordinate } from '@cats/helpers/formatCoordinate/formatCoordinate';
import { GetSiteDetailsBySiteIdQuery } from '../Details.generated';
import styles from '../Details.module.css';
import 'leaflet/dist/leaflet.css';

const mapMarkerIcon = new Icon({
  iconUrl: mapMarkerDefault,
  iconSize: [50, 65],
  iconAnchor: [25, 65],
});

const getSiteDetailsColumns = (primarySiteId: string): TableColumn[] => [
  {
    id: 1,
    displayName: 'Site ID',
    active: true,
    graphQLPropertyName: 'id',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    columnSize: ColumnSize.XtraSmall,
    renderCell: (value: any) => {
      return (
        <a
          href={`${import.meta.env.VITE_SITE_REGISTRY_URL}/site/details/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.siteLink}
        >
          {value} <ExternalLink />
        </a>
      );
    },
  },
  {
    id: 2,
    displayName: 'Site Address',
    active: true,
    graphQLPropertyName: 'addrLine_1,addrLine_2,addrLine_3,addrLine_4',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
  },
  {
    id: 3,
    displayName: 'City',
    active: true,
    graphQLPropertyName: 'city',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
  },
  {
    id: 3,
    displayName: 'Relevance',
    active: true,
    graphQLPropertyName: 'id',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return value === primarySiteId ? 'Source Site' : 'Associated Site';
    },
  },
  {
    id: 5,
    displayName: 'Last Updated',
    active: true,
    graphQLPropertyName: 'whenUpdated',
    displayType: { type: FormFieldType.Label },
    dynamicColumn: true,
    renderCell: (value: any) => {
      return formatDateUTC(value);
    },
  },
];

type SiteDetailsType =
  GetSiteDetailsBySiteIdQuery['getSiteDetailsBySiteId']['data'];

interface SiteDetailsProps {
  primarySite: SiteDetailsType;
  associatedSites: NonNullable<SiteDetailsType>['associatedSites'];
  loading: boolean;
}

export const SiteDetails = ({
  primarySite,
  associatedSites,
  loading,
}: SiteDetailsProps) => {
  const [tableFilter, setTableFilter] = useState<
    'ALL' | 'SOURCE' | 'ASSOCIATED'
  >('ALL');

  let tableData = [
    primarySite,
    ...associatedSites.map((site) => site.associatedSite),
  ];

  if (tableFilter === 'SOURCE') {
    tableData = [primarySite];
  } else if (tableFilter === 'ASSOCIATED') {
    tableData = associatedSites.map((site) => site.associatedSite);
  }

  const siteCoordinates = {
    lat: primarySite?.latdeg || 0,
    lng: primarySite?.longdeg || 0,
  };
  return (
    <CollapsiblePanel
      loading={loading}
      label={
        <div className="d-flex gap-3 align-items-center">
          <span>Site Information</span>
          {primarySite?.id && !associatedSites.length && (
            <a
              href={`${import.meta.env.VITE_SITE_REGISTRY_URL}/site/details/${primarySite.id}`}
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
      content={
        <div>
          {associatedSites.length > 0 ? (
            <div>
              <div className={styles.siteDetailsHeader}>
                <Button
                  variant="tertiary"
                  onClick={() => setTableFilter('ALL')}
                  className={cx({
                    'fw-bold': tableFilter === 'ALL',
                  })}
                >
                  All
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => setTableFilter('SOURCE')}
                  className={cx({
                    'fw-bold': tableFilter === 'SOURCE',
                  })}
                >
                  Source
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => setTableFilter('ASSOCIATED')}
                  className={cx({
                    'fw-bold': tableFilter === 'ASSOCIATED',
                  })}
                >
                  Associated
                </Button>
              </div>
              <Widget
                title={''}
                tableColumns={getSiteDetailsColumns(primarySite?.id || '')}
                tableData={tableData}
                tableIsLoading={RequestStatus.idle}
              />
            </div>
          ) : (
            <div className={styles.siteInfoContainer}>
              {primarySite && (
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
                        href={`${import.meta.env.VITE_SITE_REGISTRY_URL}/site/details/${primarySite?.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.siteLink}
                      >
                        {primarySite?.id} <ExternalLink />
                      </a>
                    </div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.cell}>
                    <label>Latitude</label>
                    <div>{formatCoordinate(siteCoordinates.lat)}</div>
                  </div>
                  <div className={styles.cell}>
                    <label>Longitude</label>
                    <div>{formatCoordinate(siteCoordinates.lng)}</div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.cell}>
                    <label>Address</label>
                    <div>
                      {[
                        primarySite?.addrLine_1,
                        primarySite?.addrLine_2,
                        primarySite?.addrLine_3,
                        primarySite?.addrLine_4,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                  <div className={styles.cell}>
                    <label>Region</label>
                    <div>{primarySite?.city}</div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.cell}>
                    <label>Common Name</label>
                    <div>{primarySite?.commonName}</div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.cell}>
                    <label>Site Risk Classification</label>
                    <div>{primarySite?.siteRiskCode}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
