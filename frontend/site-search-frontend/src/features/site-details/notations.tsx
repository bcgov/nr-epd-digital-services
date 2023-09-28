import { Button, Dropdown, DropdownButton } from 'react-bootstrap'
import styles from './css/notations.module.css'
import siteDetailsStyles from '@/pages/site-details.module.css'
import SiteGridItem from './SiteGridItem'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Notation, Site } from '@/api/sites';
import { RootState } from '@/store';


export default function Notations() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    

    console.log('site notations', site.notations);

    function newNotation(){
        console.log('new notation clicked, update store');
    }


    return (
        <div>

            {/* <div className={siteDetailsStyles.metadataGrid}> */}
            <div className="row my-4">
                <div className="col-10">
                    <input type="text" className={"form-control " + styles.searchBar} placeholder="Search Notations" aria-label="Search Notations" />
                </div>
                <div className="col-2">
                    <DropdownButton variant='outline-secondary' id="dropdown-notation-search-type" title="Sort results by: Date">
                        <Dropdown.Item eventKey='Date'>Date</Dropdown.Item>
                        <Dropdown.Item eventKey='???'>???</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            {editMode && <Button onClick={newNotation} variant='secondary'>+ New Notation</Button> }

            {site.notations.map((siteNotationData, index) => {
                return <NotationItem key={index} notation={siteNotationData} index={index} />
            })}


        </div>
    )
}


function NotationItem( { notation, index }: {notation: Notation, index: number} ) {
    const isMinistry = useSelector((state: RootState) => state.user.isMinistry);
    const editMode = useSelector((state: RootState) => state.edit.editMode)

    return (
        <div className={styles.notationItem}>
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex">
                    <p>Notation {index + 1}</p>
                    {isMinistry && <p className='mx-3'>Created: {notation.createdAt.toISOString().split('T')[0]}</p> }
                </div>
                <div className="d-inline-flex">
                    <p className='mx-3'>SR</p>
                    <p>DELETE</p>
                </div>
            </div>
            <div className={siteDetailsStyles.metadataGrid}>
                <SiteGridItem label='Notation Type' value={notation.notationType} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode} />
                <SiteGridItem label='Notation Class' value={notation.notationClass} extraClasses={siteDetailsStyles.gridFullwidth} showSR={editMode}  />

                <SiteGridItem label='Initiated' value={notation.initiated.toISOString().split('T')[0]} showSR={editMode} extraClasses={siteDetailsStyles.gridHalfWidth} />
                <SiteGridItem label='Completed' value={notation.completed.toISOString().split('T')[0]} showSR={editMode} extraClasses={siteDetailsStyles.gridHalfWidth} />
                <SiteGridItem label='Ministry Contact' value={notation.ministryContact} showSR={editMode} extraClasses={siteDetailsStyles.gridHalfWidth} />
                <SiteGridItem label='Note' value={notation.note} showSR={editMode} extraClasses={siteDetailsStyles.gridSpan3} />
                <SiteGridItem label='Required Actions' value={notation.requestedActions} showSR={editMode} extraClasses={siteDetailsStyles.gridFullwidth} />
            </div>


            <div>
                <div className="mt-4 d-flex justify-content between">
                    <div className="d-inline-flex">
                        <Button variant='secondary'>+ Add</Button>
                        <Button disabled={true} variant='secondary'>Make Selected Visible to Public</Button>
                    </div>
                </div>
                Todo table goes here.
            </div>
        </div>
    )
}
