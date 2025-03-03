import ParticipantTable from './ParticipantsTable';
import { UserMode } from '../../../../../helpers/requests/userMode';
import { UserType } from '../../../../../helpers/requests/userType';
import GetConfig from './ParticipantsConfig';
import { useParams } from 'react-router-dom';
import './Participants.css';
import { useGetAppParticipantsByAppIdQuery } from './hooks/Participants.generated';

export const Participants = () => {
  //const { id } = useParams<{ id?: string }>();  //TODO when we have the applicationId available at ALL Applications page
  const applicationId = 1; //hardcoded for now
  const { participantColumnInternal } = GetConfig();

  const { data, loading } = useGetAppParticipantsByAppIdQuery({
    variables: {
      applicationId,
    },
  });

  return (
    <div>
      <ParticipantTable
        handleTableChange={() => {}}
        handleWidgetCheckBox={() => {}}
        internalRow={participantColumnInternal}
        userType={UserType.Internal}
        formData={data?.getAppParticipantsByAppId.data}
        viewMode={UserMode.Default}
        handleTableSort={() => {}}
        handleAddParticipant={() => {}}
        selectedRows={[]}
        handleRemoveParticipant={() => {}}
        handleItemClick={() => {}}
        loading={loading}
      />
    </div>
  );
};
