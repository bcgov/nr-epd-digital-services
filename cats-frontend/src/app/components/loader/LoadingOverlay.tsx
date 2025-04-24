import React from 'react';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div
      className={styles.overlay}
      data-testid="loading-overlay"
      aria-busy={loading}
    >
      <div className={styles.loader} data-testid="loader"></div>
    </div>
  );
};

export const LoadingSpinner = () => {
  return <div className="loader" data-testid="loader"></div>;
};

export default LoadingOverlay;
