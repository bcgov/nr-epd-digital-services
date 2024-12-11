import React, { FC } from 'react';
import './PageContainer.css';

interface PageContainerProps {
  role: string;
  children: any;
}

const PageContainer: FC<PageContainerProps> = ({ role, children }) => {
  return (
    <div className="page-continer" role={role}>
      {children}
    </div>
  );
};

export default PageContainer;
