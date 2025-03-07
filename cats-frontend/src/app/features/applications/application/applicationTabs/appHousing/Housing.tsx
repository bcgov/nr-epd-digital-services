import { useParams } from 'react-router-dom';
import { Button } from '../../../../../components/button/Button';
import { Plus } from '../../../../../components/common/icon';
import Widget from '../../../../../components/widget/Widget';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { getApplicationHousingColumns } from './applicationHousingTableConfig';
import { useGetApplicationHousingByApplicationIdQuery } from './Housing.generated';

export const Housing = () => {
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

  const { data, loading } = useGetApplicationHousingByApplicationIdQuery({
    variables: { applicationId },
    skip: !applicationId,
  });

  const tableChangeHandler = (event: any) => {
    if (event.property === 'edit') {
      console.log('Edit housing ', event.row.id);
    }
  };

  return (
    <Widget
      primaryKeycolumnName="id"
      tableData={data?.getApplicationHousingByApplicationId.data || []}
      title={'Housing'}
      tableColumns={getApplicationHousingColumns()}
      tableIsLoading={loading ? RequestStatus.loading : RequestStatus.idle}
      changeHandler={tableChangeHandler}
    >
      <div className="d-flex gap-2 flex-wrap">
        <Button variant="secondary">
          <Plus />
          New Housing Type
        </Button>
      </div>
    </Widget>
  );
};
