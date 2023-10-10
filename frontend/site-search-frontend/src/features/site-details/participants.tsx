import { Button } from "react-bootstrap";
import SubSearch from "./sub-search/SubSearch";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import SiteDetailsTable from "./table/SiteDetailsTable";
import { useParams } from "react-router-dom";
import { Site, SiteParticipant } from "@/api/sites";
// import { updateSite } from "../simple-search/simple-search";
import { updateSite } from '../simple-search/simple-search';

export default function Participants() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const dispatch = useDispatch();

    function newParticipant(){
        const newParticipant: SiteParticipant = {name: '', endDate: '', roles: [''], notes: '', startDate: '', siteRegistry: false};
        const newSite: Site = {
            ...site,
            participants: [...site.participants, newParticipant] 
          };

        dispatch(updateSite(newSite))
    }

    function removeParticipant(checkedObj){
        const checkedAsArray = [...Object.keys(checkedObj).map(key => checkedObj[key])];
        // console.log('remove', {checkedObj, checkedAsArray})

        const newSite: Site = {
            ...site,
            participants: [...site.participants.filter((participant, index) => {
                // if checked, we want to return false to remove it from the array
                if (checkedObj[index] === true ) {
                    return false
                }
                return true;
            })]
          };

        dispatch(updateSite(newSite))
    }

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
                onClickAdd={newParticipant}
                onClickRemove={removeParticipant}
            
            />


        </div>
    )
}