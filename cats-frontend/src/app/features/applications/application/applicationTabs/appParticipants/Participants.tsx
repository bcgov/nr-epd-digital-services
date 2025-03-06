import ParticipantTable from './ParticipantsTable';
import { UserMode } from '../../../../../helpers/requests/userMode';
import { UserType } from '../../../../../helpers/requests/userType';
import GetConfig from './ParticipantsConfig';
import './Participants.css';
import { AppParticipantFilter } from '../../../../../../generated/types';
import { useGetAppParticipantsByAppIdQuery } from './hooks/Participants.generated';
import { useEffect, useState } from 'react';

export const Participants = () => {
  //const { id } = useParams<{ id?: string }>();  //TODO when we have the applicationId available at ALL Applications page
  const applicationId = 1; //hardcoded for now

  const { participantColumnInternal } = GetConfig();

  const [data, setData] = useState<any>([]);

  const [loading, setLoading] = useState(false);

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(
    AppParticipantFilter.All,
  );

  const { data: queryData, loading: queryLoading } =
    useGetAppParticipantsByAppIdQuery({
      variables: {
        applicationId,
        filter: filterOption,
      },
    });

  useEffect(() => {
    setData(queryData?.getAppParticipantsByAppId?.data);
    setLoading(queryLoading);
  }, [filterOption, queryData, queryLoading]);

  const updateFilter = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
  };

  return (
    <div>
      <ParticipantTable
        handleTableChange={() => {}}
        handleWidgetCheckBox={() => {}}
        internalRow={participantColumnInternal}
        userType={UserType.Internal}
        formData={data}
        viewMode={UserMode.Default}
        handleTableSort={() => {}}
        handleAddParticipant={() => {}}
        selectedRows={[]}
        handleRemoveParticipant={() => {}}
        handleItemClick={() => {}}
        loading={loading}
        handleFilterChange={updateFilter}
        filter={filterOption}
      />
    </div>
  );
};
