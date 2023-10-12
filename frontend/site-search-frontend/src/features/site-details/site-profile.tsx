import { Site, SiteDisclosure } from "@/api/sites";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";
import styles from './css/siteDetails.module.css'
import { Button } from "react-bootstrap";
import SiteRegistryIcon from "@/components/SiteRegistryIcon";
import siteDetailsStyles from '@/pages/site-details.module.css'
import SiteGridItem from "./SiteGridItem";

export default function SiteProfile() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const dispatch = useDispatch();

    function newDisclosure() {
        alert('todo');
    }

    return (
        <div>
            {/* <h4>SiteProfile go here</h4> */}
            <SubSearch label='Site Disclosures'></SubSearch>
            {editMode && <Button onClick={newDisclosure} variant='secondary'>+ New Site Disclosure</Button>}

            {site.siteDisclosures.map((siteDisclosureData, index) => {
                return <SiteDisclosureItem key={siteDisclosureData.uuid} index={index} disclosure={siteDisclosureData} />
            })}
        </div>
    )
}

interface SiteDisclosureItemProps {
    index: number;
    disclosure: SiteDisclosure
}

function SiteDisclosureItem({ index, disclosure }: SiteDisclosureItemProps) {
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const isMinistry = useSelector((state: RootState) => state.user.isMinistry);
    return (
        <>
            <div className={styles.detailsItem}>
                <div className="d-flex justify-content-between mb-4">
                    <div className="d-inline-flex">
                        <h5 className='fw-bold'>Site Disclosure Statement (Sec. III and IV)</h5>
                        
                    </div>
                    {editMode && <div className="d-inline-flex">
                        <Button className='text-dark' variant='link'><SiteRegistryIcon siteRegistry={false} /><span className="ms-1 me-3">SR</span></Button>
                        <Button className='text-dark' variant='link'>Delete</Button>
                    </div>}
                </div>

                <div className={siteDetailsStyles.metadataGrid}>
                    <SiteGridItem label='Date Received' value={disclosure.dateReceived}  extraClasses={siteDetailsStyles.gridHalfWidth} />
                    <SiteGridItem label='Date Completed' value={disclosure.dateCompleted} extraClasses={siteDetailsStyles.gridHalfWidth} />
                    <SiteGridItem label='Date Local Authority Received' value={disclosure.dateLocalAuthorityReceived} extraClasses={siteDetailsStyles.gridHalfWidth} />
                    <SiteGridItem label='Date Registrar' value={disclosure.dateRegistrar} extraClasses={siteDetailsStyles.gridHalfWidth} />
                    <SiteGridItem label='Date Entered' value={disclosure.dateEntered} extraClasses={siteDetailsStyles.gridHalfWidth}/>
                </div>

                <SiteDetailsTable 
                    label='III Commercial and Industrial Purposes or Activities on Site'
                    headers={[
                        {label: 'Schedule 2 Reference', accessor: 'scheduleReference'},
                        {label: 'Description', accessor: 'description'}
                    ]} 
                    data={disclosure.commercialAndIndustrialPurposes}
                />


                    <p className='fw-bold'>IV Additional Comments and Explanations</p>

                    <div className={siteDetailsStyles.metadataGrid}>
                        <SiteGridItem extraClasses={siteDetailsStyles.gridFullwidth} label='Provide a brief summary of the planned activity and proposed land use of the site' value={disclosure.summary}></SiteGridItem>
                        <SiteGridItem extraClasses={siteDetailsStyles.gridFullwidth} label='Indicate the information used to complete this site disclosure statement including a list of record searches completed.' value={disclosure.informationUsed}></SiteGridItem>
                        <SiteGridItem extraClasses={siteDetailsStyles.gridFullwidth} label='List any past or present government orders, permits, approvals, certificates or notifications pertaining to the environmental condition of the site.' value={disclosure.pastOrPresentOrders}></SiteGridItem>
                    </div>

            </div>
        </>
    )
}