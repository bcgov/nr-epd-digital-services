import { Button } from "react-bootstrap";
import SubSearch from "./sub-search/SubSearch";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import SiteDetailsTable from "./table/SiteDetailsTable";

export default function Participants() {
    const editMode = useSelector((state: RootState) => state.edit.editMode);

    return (
        <div>
            <h4>Site Participants go here</h4>

            <SubSearch label="Participants" showResultsDropdown={true}/>


            <SiteDetailsTable 
                headers={[
                    {label: 'Participant', accessor: 'participant'},
                    {label: 'Role(s)', accessor: 'roles'},
                    {label: 'Start Date', accessor: 'startDate'},
                    {label: 'End Date', accessor: 'endDate'},
                    {label: 'Notes', accessor: 'notes'},
                ]}
                data={[
                    {participant: 'SHELL CANADA', roles: ['ORGANIZATION'], startDate: 'today', endDate: 'yesterday', notes: '', siteRegistry: false}
                ]}
            
            />


        </div>
    )
}