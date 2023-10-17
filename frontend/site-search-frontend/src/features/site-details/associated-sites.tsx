import { AssociatedSite, Site } from "@/api/sites";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";
import { updateSite } from "../simple-search/simple-search";
import { faker } from "@faker-js/faker";
import { LinkableFormControl } from "./TableEditItem";

export default function AssociatedSites() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const dispatch = useDispatch();

    function addAssociation(){
        const newAssociation: AssociatedSite = {uuid: faker.string.uuid(), dateNoted: '', notes: '', parcelID: '', siteID: '', siteRegistry: false};
        const newSite: Site = {
            ...site,
            associatedSites: [...site.associatedSites, newAssociation] 
          };

        dispatch(updateSite(newSite))
    }

    function removeAssociation(checkedObj){
        // const checkedAsArray = [...Object.keys(checkedObj).map(key => checkedObj[key])];
        // console.log('remove', {checkedObj, checkedAsArray})

        const newSite: Site = {
            ...site,
            associatedSites: [...site.associatedSites.filter((_, index) => {
                // if checked, we want to return false to remove it from the array
                if (checkedObj[index] === true ) {
                    // console.log('removing', participant)
                    return false
                }
                return true;
            })]
          };

        dispatch(updateSite(newSite))
    }

    return (
        <div>
            <SubSearch label='Associated Sites'></SubSearch>

            {/* IDEA: Put in 'renderer' or 'component' option for each header? Should set component to use for that row
            This will let us patch in custom link component?  Same with Date components. */}

            <SiteDetailsTable
                label='Associated Sites'
                headers={[
                    {label: 'Site ID', accessor: 'siteID', renderer: LinkableFormControl},
                    {label: 'Parcel ID', accessor: 'parcelID'},
                    {label: 'Date Noted', accessor: 'dateNoted'},
                    {label: 'Notes', accessor: 'notes'}
                ]}
                onClickAdd={addAssociation}
                onClickRemove={removeAssociation}
                data={site.associatedSites}
            />
        </div>
    )
}