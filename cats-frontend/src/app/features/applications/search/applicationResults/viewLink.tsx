import React from 'react';
import { Link } from 'react-router-dom';
import { FileLinesIcon } from '../../../../components/common/icon';
import './viewLink.css';

interface ViewLinkProps {
  url: string;
}

const ApplicationResultsViewLink: React.FC<ViewLinkProps> = ({ url }) => {
  return (
    <>
      <Link className="application-results__view-link" to={url}>
        <FileLinesIcon />
        View
      </Link>
    </>
  );
};

export default ApplicationResultsViewLink;
