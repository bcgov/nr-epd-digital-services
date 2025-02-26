import { User } from "oidc-client-ts"
import ParticipantTable from "./ParticipantsTable"
import { UserMode } from "../../../../../helpers/requests/userMode"
import { UserType } from "../../../../../helpers/requests/userType"
import { RequestStatus } from "../../../../../helpers/requests/status"
import { useEffect, useState } from "react"
import GetConfig from "./ParticipantsConfig"
import { useParams } from "react-router-dom"
import { fetchAppParticpants } from "./services/Participants"
import { set } from "date-fns"
import { useFetchAppParticipants } from "./hooks/useFetchAppParticipants"
import { el } from "date-fns/locale"


export const Participants = () => {
    //const { id } = useParams<{ id?: string }>();
    const applicationId = 1;
    const {
        participantColumnInternal,
      } = GetConfig();
    const [selectedRows, setSelectedRows] = useState<User[]>([])
    const [formData, setFormData] = useState<{ [key: string]: any | [Date, Date] }[]>([])
    const [internalRow, setInternalRow] = useState(participantColumnInternal);
    const {appParticipants, loading, error} = useFetchAppParticipants(applicationId ?? '');
    useEffect(() => {
        // if(id) {
        //     const fetchParticipants = async (applicationId: number) => {
        //         try {
        //             console.log("nupur - id is : ", applicationId);
        //             // Call the fetchAppParticpants function to get the participants by App ID
        //             const participants = await fetchAppParticpants(applicationId);
        //             setFormData(participants);
        //         } catch (error) {
        //             console.error('Error fetching participants:', error);
        //         }
        //     }
        //     fetchParticipants(id);
        // } else {
        //     setFormData([]);
        // }
        if(appParticipants) {
            setFormData(appParticipants);
        } else {    
            setFormData([]);
        }
    },[]);
    

    return (
        <div>
            <ParticipantTable
            handleTableChange={()=>{}}
            handleWidgetCheckBox={()=>{}}
            internalRow={internalRow}
            userType={UserType.Internal}
            formData={formData}
            status={RequestStatus.success}
            viewMode={UserMode.Default}
            handleTableSort={()=>{}}
            handleAddParticipant={()=>{}}
            selectedRows={[]}
            handleRemoveParticipant={()=>{}}
            handleItemClick={()=>{}}
      />
        </div>
    )
}