import { useParams } from 'react-router-dom';
import { DataTable } from '@cats/components/data-table';
import { useGetApplicationLinksQuery } from './LinkedApplications.generated';
import { linkedApplicationColumns } from './linkedApplicationsTableConfig';

export const LinkedApplications = () => {
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

  const { data, loading } = useGetApplicationLinksQuery({
    variables: { applicationId },
    skip: !applicationId,
  });

  if (!applicationId) {
    return null;
  }

  return (
    <DataTable
      title="Linked Applications"
      ariaLabel="Linked applications"
      data={data?.getApplicationLinks.data ?? []}
      columns={linkedApplicationColumns}
      getRowId={(row) => row.id}
      isLoading={loading}
    />
  );
};
