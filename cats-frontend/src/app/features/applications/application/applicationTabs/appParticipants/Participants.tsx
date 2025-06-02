import ParticipantTable from './ParticipantsTable';
import { UserMode } from '../../../../../helpers/requests/userMode';
import { UserType } from '../../../../../helpers/requests/userType';
import GetConfig from './ParticipantsConfig';
import './Participants.css';
import { AppParticipantFilter } from '../../../../../../generated/types';
import { useGetAppParticipantsByAppIdQuery } from './graphql/Participants.generated';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Participants = () => {
  const { id } = useParams<{ id?: string }>();
  const applicationId = id ? Number(id) : 0;

  const { participantColumnInternal } = GetConfig();

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

  const updateFilter = (newFilter: AppParticipantFilter) => {
    setFilterOption(newFilter);
  };

  return (
    <div>
      <ParticipantTable
        internalRow={participantColumnInternal}
        userType={UserType.Internal}
        appParticsData={queryData?.getAppParticipantsByAppId?.data || []}
        viewMode={UserMode.Default}
        handleTableSort={() => { }}
        handleAddParticipant={() => { }}
        handleRemoveParticipant={() => { }}
        handleItemClick={() => { }}
        loading={queryLoading}
        handleFilterChange={updateFilter}
        filter={filterOption}
        handleRefreshParticipants={refetch}
      />
    </div>
  );
};
