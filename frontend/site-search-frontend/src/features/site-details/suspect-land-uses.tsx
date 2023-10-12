import { Site, SuspectLandUse } from "@/api/sites";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";
import { updateSite } from "../simple-search/simple-search";
import { faker } from "@faker-js/faker";

export default function SuspectLandUses() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const dispatch = useDispatch();

    function newSuspectLandUse(){
        const newLandUse: SuspectLandUse = {uuid: faker.string.uuid(), landUse: '', notes: '', siteRegistry: true};
        const newSite: Site = {
            ...site,
            suspectLandUses: [...site.suspectLandUses, newLandUse]
          };

        dispatch(updateSite(newSite))
    }

    function removeLandUse(checkedObj){
        const newSite: Site = {
            ...site,
            suspectLandUses: [...site.suspectLandUses.filter((_, index) => {
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
            <SubSearch label='Suspect Land Uses'></SubSearch>

            <SiteDetailsTable
                label='Suspect Land Uses'
                headers={[
                    {label: 'Land Use', accessor: 'landUse'},
                    {label: 'Notes', accessor: 'notes'}
                ]}
                onClickAdd={newSuspectLandUse}
                onClickRemove={removeLandUse}
                data={site.suspectLandUses}
            />

        </div>
    )
}