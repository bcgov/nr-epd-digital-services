import ParticipantTable from './ParticipantsTable';
import { UserMode } from '../../../../../helpers/requests/userMode';
import { UserType } from '../../../../../helpers/requests/userType';
import GetConfig from './ParticipantsConfig';
import './Participants.css';
import { AppParticipantFilter } from '../../../../../../generated/types';
import {
  useGetAppParticipantsByAppIdQuery,
} from './graphql/Participants.generated';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Participants = () => {
  const { id } = useParams<{ id?: string }>();
  const applicationId = id ? Number(id) : 0;

  const { participantColumnInternal } = GetConfig();

  const [data, setData] = useState<any>([]);

  const [refreshParticipants, setRefreshParticipants] = useState(false);

  const [filterOption, setFilterOption] = useState<AppParticipantFilter>(
    AppParticipantFilter.All,
  );

  const {
    data: queryData,
    loading: queryLoading,
    refetch,
  } = useGetAppParticipantsByAppIdQuery({
    variables: {
      applicationId,
      filter: filterOption,
    },
  });

  useEffect(() => {
    const refetchData = async () => {
      await refetch();
      setData(queryData?.getAppParticipantsByAppId?.data);
    };
    refetchData();
  }, [filterOption, queryData, queryLoading, refreshParticipants]);

  //This takes care to refresh the participants after they are added
  const handleRefreshParticipants = () => {
    setRefreshParticipants((prev) => !prev);
  };

  const updateFilter = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
  };

  return (
    <div>
      <ParticipantTable
        handleTableChange={() => {}}
        internalRow={participantColumnInternal}
        userType={UserType.Internal}
        appParticsData={data}
        viewMode={UserMode.Default}
        handleTableSort={() => {}}
        handleAddParticipant={() => {}}
        handleRemoveParticipant={() => {}}
        handleItemClick={() => {}}
        loading={queryLoading}
        handleFilterChange={updateFilter}
        filter={filterOption}
        handleRefreshParticipants={handleRefreshParticipants}
      />
    </div>
  );
};
