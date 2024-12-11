import React from 'react';
import { BannerMessages } from '../../helpers/requests/bannerMessages';
import {
  ExclamationCircle,
  ExclamationTriangle,
  TickIcon,
} from '../common/icon';
import Banner from './Banner';

interface BannerDetailsProps {
  bannerType: string;
  snapshotDate?: string;
}

const BannerDetails: React.FC<BannerDetailsProps> = ({
  bannerType,
  snapshotDate,
}) => {
  if (!snapshotDate && bannerType !== BannerMessages.pending) {
    return null;
  }

  let type = '';
  let bannerLabel = '';
  let iconType = <></>;
  let customClassForBanner = '';
  let customClassForIcon = '';
  let detailMessageNode = <div data-testid="invalid-type" />;

  switch (bannerType) {
    case BannerMessages.outdated:
      bannerLabel = BannerMessages.outdatedLabel;
      iconType = <ExclamationCircle />;
      customClassForBanner = 'message-outdated';
      customClassForIcon = 'icon-outdated';
      detailMessageNode = (
        <div className="d-flex justify-content-between status-message-details p-4 message-outdated">
          {BannerMessages.outdatedMessage}
        </div>
      );
      break;
    case BannerMessages.pending:
      bannerLabel = BannerMessages.pendingLabel;
      iconType = <ExclamationTriangle />;
      customClassForBanner = 'message-pending';
      customClassForIcon = 'icon-pending';
      detailMessageNode = (
        <div className="d-flex justify-content-between status-message-details message-pending">
          <div className="d-flex m-1 m-2">{BannerMessages.pendingMessage1}</div>
          <div className="m-2">
            <span>{BannerMessages.pendingMessage2}</span>
            <span className="detail-message-3">
              <a
                href={`mailto:${BannerMessages.pendingMessage3}`}
                style={{ textDecoration: 'none' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {BannerMessages.pendingMessage3}
              </a>
            </span>
          </div>
        </div>
      );
      break;
    case BannerMessages.current:
      bannerLabel = BannerMessages.currentLabel;
      customClassForBanner = 'message-current';
      customClassForIcon = 'icon-current';
      iconType = <TickIcon data-testid={'tick-icon'} />;
      break;
    default:
      bannerLabel = BannerMessages.blankMessage;
      break;
  }
  return (
    <div>
      <Banner
        bannerLabel={bannerLabel}
        iconType={iconType}
        customClassForBanner={customClassForBanner}
        customClassForIcon={customClassForIcon}
        detailMessageNode={detailMessageNode}
        snapshotDate={snapshotDate}
      />
    </div>
  );
};

export default BannerDetails;
