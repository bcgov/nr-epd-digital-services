import { Button, Dropdown, DropdownButton } from 'react-bootstrap'
import styles from './css/notations.module.css'
import siteDetailsStyles from '@/pages/site-details.module.css'
import SiteGridItem from './SiteGridItem'

function NotationItem() {

    return (
        <div className={styles.notationItem}>
            <div className="d-flex justify-content-between">
                <div className="d-inline-flex">
                    <p>Notation 1</p>
                    <p className='mx-3'>Created: 1234-01-12</p>
                </div>
                <div className="d-inline-flex">
                    <p className='mx-3'>SR</p>
                    <p>DELETE</p>
                </div>
            </div>
            <div>
                <SiteGridItem label='Notation Type' value='todo' extraClasses={siteDetailsStyles.gridFullwidth} editMode={false} />

            </div>
        </div>
    )
}


export default function Notations() {

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

            <NotationItem />


        </div>
    )
}