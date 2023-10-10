import { Site } from "@/api/sites";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";

export default function AssociatedSites() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));

    return (
        <div>
            <SubSearch label='Associated Sites'></SubSearch>

            {/* IDEA: Put in 'renderer' or 'component' option for each header? Should set component to use for that row
            This will let us patch in custom link component?  Same with Date components. */}

            <SiteDetailsTable
                label='Associated Sites'
                headers={[
                    {label: 'Site ID', accessor: 'siteID'},
                    {label: 'Parcel ID', accessor: 'parcelID'},
                    {label: 'Date Noted', accessor: 'dateNoted'},
                    {label: 'Notes', accessor: 'notes'}
                ]}
                data={site.associatedSites}
            />
        </div>
    )
}