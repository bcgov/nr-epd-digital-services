import { ParcelDescription, Site } from "@/api/sites";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";
import { faker } from "@faker-js/faker";
import { updateSite } from "../simple-search/simple-search";

export default function ParcelDescriptionSubPage() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));

    const dispatch = useDispatch();

    function newParcelDescription(){
        const newParcel: ParcelDescription = {uuid: faker.string.uuid(), crownLandFileNumber: '', crownLandUsePIN: '', dateNoted: '', landDescription: '', parcelID: '', siteRegistry: false };
        const newSite: Site = {
            ...site,
            parcelDescriptions: [...site.parcelDescriptions, newParcel]
          };

        dispatch(updateSite(newSite))
    }

    function removeParcel(checkedObj){
        const newSite: Site = {
            ...site,
            parcelDescriptions: [...site.parcelDescriptions.filter((_, index) => {
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
                onClickAdd={newParcelDescription}
                onClickRemove={removeParcel}
                data={site.parcelDescriptions}
                />
        </div>
    )
}