import React from 'react';
import PageContainer from '../../../components/simple/PageContainer';
import { useApplicationsV2 } from './hooks/useApplicationsV2';
import { APPLICATIONS_SEARCH_ERROR_MESSAGE } from './api/ApplicationsApi';

const ApplicationsV2: React.FC = () => {
  const { data, isPending, isError } = useApplicationsV2();

  return (
    <PageContainer role="ApplicationsV2">
      <h1>Applications (v2 preview)</h1>
      {isPending && <p>Loading...</p>}
      {isError && <p>{APPLICATIONS_SEARCH_ERROR_MESSAGE}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </PageContainer>
  );
};

export default ApplicationsV2;
