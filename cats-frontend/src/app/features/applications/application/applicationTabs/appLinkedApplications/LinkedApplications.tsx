import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable } from '@cats/components/data-table';
import { Button } from '@cats/components/button/Button';
import { useGetApplicationLinksQuery } from './LinkedApplications.generated';
import { linkedApplicationColumns } from './linkedApplicationsTableConfig';
import { LinkApplicationEditor } from './LinkApplicationEditor';

export const LinkedApplications = () => {
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);
  const [editorOpen, setEditorOpen] = useState(false);

  const { data, loading, refetch } = useGetApplicationLinksQuery({
    variables: { applicationId },
    skip: !applicationId,
  });

  if (!applicationId) {
    return null;
  }

  const rows = data?.getApplicationLinks.data ?? [];

  return (
    <>
      <DataTable
        title="Linked Applications"
        ariaLabel="Linked applications"
        data={rows}
        columns={linkedApplicationColumns}
        getRowId={(row) => row.id}
        isLoading={loading}
        toolbarActions={
          <Button
            type="button"
            variant="primary"
            disabled={loading || !data}
            onClick={() => setEditorOpen(true)}
          >
            Link Application
          </Button>
        }
      />
      {editorOpen && (
        <LinkApplicationEditor
          cssaApplicationId={applicationId}
          rows={rows}
          onCancel={() => setEditorOpen(false)}
          onSaved={() => {
            void refetch();
            setEditorOpen(false);
          }}
        />
      )}
    </>
  );
};
