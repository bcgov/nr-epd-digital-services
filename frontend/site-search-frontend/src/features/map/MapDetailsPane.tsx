import styles from '@/pages/map.module.css'
import CloseButton from 'react-bootstrap/esm/CloseButton';
import Button from 'react-bootstrap/Button';


export default function MapDetailsPane({site}) {
    return (

        <div className={styles.detailsPane}>
            <div className="d-flex justify-content-between">
                <span>&gt; Back</span>
                <CloseButton />
            </div>

            <div className="fst-italic my-3">Last Updated: </div>


            <div className={styles.detailsPaneContent + " d-flex mb-3"}>                
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Site ID</div>
                    <div>128381</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Latitude</div>
                    <div>49d 123s 123a</div>
                </div>
                <div className="d-flex flex-column ">
                    <div className='fw-bold'>Longitude</div>
                    <div>49d 123s 123a</div>
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
                <div>N/A</div>
            </div>

            <div className="mb-3">
                <div className='fw-bold'>Region</div>
                <div>N/A</div>
            </div>

            <div className="mb-3">
                <div className='fw-bold'>Parcel IDs</div>
                <div>N/A</div>
            </div>

            <Button variant='secondary' className='w-100'>View Site Details</Button>


        </div>

    );
}