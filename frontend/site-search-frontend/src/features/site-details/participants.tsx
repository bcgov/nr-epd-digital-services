import { Button } from "react-bootstrap";
import SubSearch from "./sub-search/SubSearch";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import SiteDetailsTable from "./table/SiteDetailsTable";
import { useParams } from "react-router-dom";
import { Site } from "@/api/sites";

export default function Participants() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    // const dispatch = useDispatch();

    return (
        <div>
            <SubSearch label="Participants" showResultsDropdown={true}/>


            <SiteDetailsTable 
                label='Site Participants'
                headers={[
                    {label: 'Participant', accessor: 'name'},
                    {label: 'Role(s)', accessor: 'roles'},
                    {label: 'Start Date', accessor: 'startDate'},
                    {label: 'End Date', accessor: 'endDate'},
                    {label: 'Notes', accessor: 'notes'},
                ]}
                data={site.participants}
            
            />


        </div>
    )
}