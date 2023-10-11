import styles from '@/pages/map.module.css'
import CloseButton from 'react-bootstrap/esm/CloseButton';
import Button from 'react-bootstrap/Button';
import { Site } from '@/api/sites';
import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { formatLatLng } from '@/helpers/formatLatLng';


export default function MapDetailsPane({site, onClose}: {site: Site, onClose: MouseEventHandler}) {
    return (

        <div className={styles.detailsPane + " " + ( site ? 'fadeIn' : 'fadeOut')}>
            <div className="d-flex justify-content-between">
                <CloseButton onClick={onClose} />
            </div>

            <div className="fst-italic my-3">Last Updated: {site?.lastUpdated}</div>


            <div className={styles.detailsPaneContent + " d-flex mb-3"}>                
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Site ID</div>
                    <div>{site?.siteID}</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Latitude</div>
                    <div>{formatLatLng(site?.latitude)}</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Longitude</div>
                    <div>{formatLatLng(site?.longitude)}</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Victoria File</div>
                    <div>26250-20/18326</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Regional File</div>
                    <div>N/A</div>
                </div>
            </div>

            <div className="mb-3">
                <div className='fw-bold'>Common Name</div>
                <div>{site?.address} </div>
            </div>

            <div className="mb-3">
                <div className='fw-bold'>Region</div>
                <div>{site?.region}</div>
            </div>

            <div className="mb-3">
                <div className='fw-bold'>Parcel IDs</div>
                <div>N/A</div>
            </div>

            <Link to={`/site/${site?.siteID}/`}>
                <Button variant='secondary' className='w-100'>
                    View Site Details
                </Button>
            </Link>


        </div>

    );
}