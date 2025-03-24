import ParticipantTable from './ParticipantsTable';
import { UserMode } from '../../../../../helpers/requests/userMode';
import { UserType } from '../../../../../helpers/requests/userType';
import GetConfig from './ParticipantsConfig';
import './Participants.css';
import { AppParticipantFilter } from '../../../../../../generated/types';
import { useGetAppParticipantsByAppIdQuery, useGetParticipantRolesQuery } from './graphql/Participants.generated';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Participants = () => {
  const { id = undefined } = useParams<{ id?: string }>(); 
  const applicationId = id ? Number(id) : 0;

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
        internalRow={participantColumnInternal}
        userType={UserType.Internal}
        appParticsData={data}
        viewMode={UserMode.Default}
        handleTableSort={() => {}}
        handleAddParticipant={() => {}}
        handleRemoveParticipant={() => {}}
        handleItemClick={() => {}}
        loading={loading}
        handleFilterChange={updateFilter}
        filter={filterOption}
      />
    </div>
  );
};
