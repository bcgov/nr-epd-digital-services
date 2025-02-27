import { User } from 'oidc-client-ts';
import ParticipantTable from './ParticipantsTable';
import { UserMode } from '../../../../../helpers/requests/userMode';
import { UserType } from '../../../../../helpers/requests/userType';
import { RequestStatus } from '../../../../../helpers/requests/status';
import { useEffect, useState } from 'react';
import GetConfig from './ParticipantsConfig';
import { useParams } from 'react-router-dom';
import { fetchAppParticpants } from './services/Participants';
import { set } from 'date-fns';
import { useFetchAppParticipants } from './hooks/useFetchAppParticipants';
import './Participants.css';

export const Participants = () => {
  //const { id } = useParams<{ id?: string }>();  //TODO when we have the applicationId available at ALL Applications page
  const applicationId = 1; //hardcoded for now
  const { participantColumnInternal } = GetConfig();
  const [formData, setFormData] = useState<
    { [key: string]: any | [Date, Date] }[]
  >([]);
  const [internalRow, setInternalRow] = useState(participantColumnInternal);
  const { appParticipants, loading, error } = useFetchAppParticipants(
    applicationId ?? '',
  );
  useEffect(() => {
    if (appParticipants && appParticipants.length > 0) {
      setFormData(appParticipants);
    } else {
      setFormData([]);
    }
  }, [appParticipants]);

  return (
    <div>
      <ParticipantTable
        handleTableChange={() => {}}
        handleWidgetCheckBox={() => {}}
        internalRow={internalRow}
        userType={UserType.Internal}
        formData={formData}
        status={RequestStatus.success}
        viewMode={UserMode.Default}
        handleTableSort={() => {}}
        handleAddParticipant={() => {}}
        selectedRows={[]}
        handleRemoveParticipant={() => {}}
        handleItemClick={() => {}}
      />
    </div>
  );
};
