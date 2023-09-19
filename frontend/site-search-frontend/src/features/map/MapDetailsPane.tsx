import styles from '@/pages/map.module.css'
import CloseButton from 'react-bootstrap/esm/CloseButton';
import Button from 'react-bootstrap/Button';
import { Site } from '@/api/sites';
import { MouseEventHandler } from 'react';


export default function MapDetailsPane({site, onClose}: {site: Site, onClose: MouseEventHandler}) {
    return (

        <div className={styles.detailsPane + " " + ( site ? 'fadeIn' : 'fadeOut')}>
            <div className="d-flex justify-content-between">
                <span>&gt; Back</span>
                <CloseButton onClick={onClose} />
            </div>

            <div className="fst-italic my-3">Last Updated: {site?.lastUpdated.toISOString().split('T')[0]}</div>


            <div className={styles.detailsPaneContent + " d-flex mb-3"}>                
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Site ID</div>
                    <div>{site?.siteID}</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Latitude</div>
                    <div>{site?.latitude}</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Longitude</div>
                    <div>{site?.longitude}</div>
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

            <Button variant='secondary' className='w-100'>View Site Details</Button>


        </div>

    );
}