import { Site } from "@/api/sites";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";

export default function ParcelDescription() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));


    return (
        <div>
             <SubSearch label='Parcel Descriptions'></SubSearch>

             <SiteDetailsTable
                label='Parcel Descriptions'
                headers={[
                    {label: 'Date Noted', accessor: 'dateNoted'},
                    {label: 'Parcel ID', accessor: 'parcelID'},
                    {label: 'Crown Land PIN', accessor: 'crownLandUsePIN'},
                    {label: 'Crown Lands File Number', accessor: 'crownLandFileNumber'},
                    {label: 'Land Description', accessor: 'landDescription'}
                ]}
                data={site.parcelDescriptions}
                />
        </div>
    )
}