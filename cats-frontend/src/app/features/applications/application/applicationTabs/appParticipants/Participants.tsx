import { User } from "oidc-client-ts"
import ParticipantTable from "./ParticipantsTable"
import { UserMode } from "../../../../../helpers/requests/userMode"
import { UserType } from "../../../../../helpers/requests/userType"
import { RequestStatus } from "../../../../../helpers/requests/status"
import { useState } from "react"
import GetConfig from "./ParticipantsConfig"

export const Participants = () => {
    const {
        participantColumnInternal,
      } = GetConfig();
    const [selectedRows, setSelectedRows] = useState<User[]>([])
    const [formData, setFormData] = useState<{ [key: string]: any | [Date, Date] }[]>([])
    const [internalRow, setInternalRow] = useState(participantColumnInternal);
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