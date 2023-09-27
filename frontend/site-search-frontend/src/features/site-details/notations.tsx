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

    console.log('site notations', site.notations);


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

            <Button variant='secondary'>+ New Notation</Button>

            {/* TODO - Make below it's own component, even in same page? */}

            {/* <NotationItem /> */}
            {site.notations.map((siteNotationData, index) => {
                return <NotationItem key={index} notation={siteNotationData} index={index} />
            })}


        </div>
    )
}


function NotationItem( { notation, index }: {notation: Notation, index: number} ) {

    return (
        <div className={styles.notationItem}>
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex">
                    <p>Notation {index + 1}</p>
                    <p className='mx-3'>Created: {notation.createdAt.toISOString().split('T')[0]}</p>
                </div>
                <div className="d-inline-flex">
                    <p className='mx-3'>SR</p>
                    <p>DELETE</p>
                </div>
            </div>
            <div>
                <SiteGridItem label='Notation Type' value={notation.notationType} extraClasses={siteDetailsStyles.gridFullwidth} editMode={false} />
                <SiteGridItem label='Notation Class' value={notation.notationClass} extraClasses={siteDetailsStyles.gridFullwidth} editMode={false} />

            </div>
        </div>
    )
}
