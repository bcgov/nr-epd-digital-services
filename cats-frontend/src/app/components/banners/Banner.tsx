import React, { ReactNode } from 'react';
import './banner.css';

interface BannerProps {
  bannerLabel: string;
  iconType: ReactNode;
  customClassForBanner?: string;
  customClassForIcon?: string;
  detailMessageNode?: ReactNode;
  snapshotDate?: string;
}

const Banner: React.FC<BannerProps> = ({
  bannerLabel,
  iconType,
  customClassForBanner,
  customClassForIcon,
  detailMessageNode,
  snapshotDate,
}) => {
  const bannerClass = `d-flex align-items-center status-banner-message ${customClassForBanner || ''}`;
  const iconClass = `m-1 m-2 icon ${customClassForIcon || ''}`;

  return (
    <div>
      {/* Banner Type Message Section */}
      <div className="d-flex status-banner-container">
        <div role="banner" className={bannerClass}>
          <span className={iconClass}>{iconType}</span>
          <span className="status-message">{bannerLabel}</span>
        </div>
        {snapshotDate && <span className="snapshot m-2">{snapshotDate}</span>}
      </div>
      {detailMessageNode}
    </div>
  );
};

export default Banner;
