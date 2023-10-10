import { Site } from "@/api/sites";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";

export default function SuspectLandUses() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));


    return (
        <div>
            <SubSearch label='Suspect Land Uses'></SubSearch>

            <SiteDetailsTable
                label='Suspect Land Uses'
                headers={[
                    {label: 'Land Use', accessor: 'landUse'},
                    {label: 'Notes', accessor: 'notes'}
                ]}
                data={site.suspectLandUses}
            />

        </div>
    )
}