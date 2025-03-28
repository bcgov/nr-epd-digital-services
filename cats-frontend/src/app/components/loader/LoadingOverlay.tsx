import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="overlay" data-testid="loading-overlay" aria-busy={loading}>
      <div className="loader" data-testid="loader"></div>
    </div>
  );
};

export default LoadingOverlay;
