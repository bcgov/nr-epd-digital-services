import React from 'react';
import { render, screen } from '@testing-library/react';
import BannerDetails from './BannerDetails';
import { BannerMessages } from '../../helpers/requests/bannerMessages'; // Assuming BannerMessages is imported or defined elsewhere
import Banner from './Banner';

describe('BannerDetails', () => {
  const snapshotDate = new Date().toISOString();
  it('renders without crashing', () => {
    render(
      <BannerDetails
        snapshotDate={snapshotDate}
        bannerType={BannerMessages.outdated}
      />,
    );
    expect(screen.getByText('Outdated')).toBeInTheDocument();
  });

  it('renders outdated message correctly', () => {
    render(
      <BannerDetails
        snapshotDate={snapshotDate}
        bannerType={BannerMessages.outdated}
      />,
    );
    expect(
      screen.getByText(
        (_, element) => element?.textContent === BannerMessages.outdatedMessage,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveClass('message-outdated');
  });

  it('renders pending message correctly', () => {
    render(
      <BannerDetails
        snapshotDate={snapshotDate}
        bannerType={BannerMessages.pending}
      />,
    );
    expect(
      screen.getByText(BannerMessages.pendingMessage1),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) => element?.textContent === BannerMessages.pendingMessage2,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(BannerMessages.pendingMessage3),
    ).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveClass('message-pending');
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      `mailto:${BannerMessages.pendingMessage3}`,
    );
  });

  it('renders current message correctly', () => {
    render(
      <BannerDetails
        snapshotDate={snapshotDate}
        bannerType={BannerMessages.current}
      />,
    );
    expect(screen.getByRole('banner')).toHaveClass('message-current');
    expect(screen.getByTestId('tick-icon')).toBeInTheDocument();
  });

  it('renders default message correctly when no type is found', () => {
    render(
      <BannerDetails snapshotDate={snapshotDate} bannerType="unknownType" />,
    );
    expect(screen.getByTestId('invalid-type')).toBeInTheDocument();
  });
});

describe('Banner Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <Banner bannerLabel="Test Banner" iconType={<span>Icon</span>} />,
    );
    expect(getByText('Test Banner')).toBeInTheDocument();
  });

  it('renders with snapshotDate if provided', () => {
    const { getByText } = render(
      <Banner
        bannerLabel="Test Banner"
        iconType={<span>Icon</span>}
        snapshotDate="2023-04-01"
      />,
    );
    expect(getByText('2023-04-01')).toBeInTheDocument();
  });

  it('renders detailMessageNode if provided', () => {
    const detailMessage = <div>Detail Message</div>;
    const { getByText } = render(
      <Banner
        bannerLabel="Test Banner"
        iconType={<span>Icon</span>}
        detailMessageNode={detailMessage}
      />,
    );
    expect(getByText('Detail Message')).toBeInTheDocument();
  });
});
