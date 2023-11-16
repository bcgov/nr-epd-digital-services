import { Site, SiteDocument } from "@/api/sites";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import styles from './css/siteDetails.module.css'
import { Button } from "react-bootstrap";
import SiteRegistryIcon from "@/components/SiteRegistryIcon";
import siteDetailsStyles from '@/pages/site-details.module.css'
import SiteGridItem, { SiteGridDateItem } from "./SiteGridItem";
import SiteDetailsTable from "./table/SiteDetailsTable";

export default function Documents() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const dispatch = useDispatch();

    function newDocument(){
        console.log('todo');
    }


    return (
        <div>
            <h4>Documents go here</h4>
            <SubSearch label='Documents' showResultsDropdown={false} />

            {editMode && <Button onClick={newDocument} variant='secondary'>+ Upload New Document</Button>}

            {site.documents.map((siteDocumentData, index) => {
                // return <NotationItem key={siteNotationData.uuid} notation={siteNotationData} index={index} onClickAddParticipant={newParticipant} onClickRemoveParticipant={removeParticipant} onClickDeleteNotation={clickDeleteNotation} />
                // return <DocumentItem key={index} document={siteDocumentData} index={index} onClickAddParticipant={newParticipant} onClickRemoveParticipant={removeParticipant} onClickDeleteNotation={clickDeleteNotation} />
                return <DocumentItem key={index} document={siteDocumentData} index={index}  />
            })}
        </div>
    )
}

interface DocumentItemProps {
    index: number;
    document: SiteDocument;
}

function DocumentItem({document, index}: DocumentItemProps) {

    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const isMinistry = useSelector((state: RootState) => state.user.isMinistry);

    return (
        <>

            <div className={styles.detailsItem}>
                <div className="d-flex justify-content-between mb-4">
                    <div className="d-inline-flex">
                        <h5 className='fw-bold'></h5>
                        <p>Document {index + 1}</p>
                        {isMinistry && <p className='mx-3'>Uploaded: {document.uploadedDate}</p>} 
                    </div>
                    {editMode && <div className="d-inline-flex">
                        <Button className='text-dark' variant='link'><SiteRegistryIcon siteRegistry={false} /><span className="ms-1 me-3">SR</span></Button>
                        <Button className='text-dark' variant='link'>REPLACE FILE</Button>
                        <Button className='text-dark' variant='link'>DELETE</Button>
                    </div>}
                </div>

                <div className={siteDetailsStyles.metadataGrid}>
                    <SiteGridDateItem label='Document Date' value={document.documentDate} extraClasses={siteDetailsStyles.gridHalfWidth}  />
                    <SiteGridDateItem label='Received Date' value={document.receivedDate} extraClasses={siteDetailsStyles.gridHalfWidth} />
                    <SiteGridItem label='Links' value={'View Online | Links'} extraClasses={siteDetailsStyles.gridSpan4 } />
                    <SiteGridItem label='Title' value={document.title} extraClasses={siteDetailsStyles.gridSpan6 } />
                </div>

                <SiteDetailsTable
                    label='Document Participants'
                    headers={[
                        {label: 'Name', accessor: 'name'},
                        {label: 'Role', accessor: 'role'}
                    ]}
                    data={document.participants}
                />

            </div>

        
        </>
    )

}