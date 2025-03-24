import React from 'react';
import { FileLinesIcon } from '../../../../components/common/icon';
import './viewLink.css';

interface ViewLinkProps {
  url: string;
}

const ApplicationResultsViewLink: React.FC<ViewLinkProps> = ({ url }) => {
  return (
    <>
      <FileLinesIcon />
      <a
        className="application-results__view-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </a>
    </>
  );
};

export default ApplicationResultsViewLink;
