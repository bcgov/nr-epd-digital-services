import React, { FC } from 'react';
import './PageContainer.css';
import clsx from 'clsx';

interface PageContainerProps {
  role: string;
  children: any;
  customContainerClass?: string;
}

const PageContainer: FC<PageContainerProps> = ({
  role,
  customContainerClass,
  children,
}) => {
  return (
    <div className={clsx(customContainerClass || 'page-continer')} role={role}>
      {children}
    </div>
  );
};

export default PageContainer;
