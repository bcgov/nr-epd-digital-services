import { Site } from "@/api/sites";
import Header from "@/components/Header"
import { RootState } from "@/store";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styles from './site-details.module.css'
import FlexRowItem from "@/components/FlexRowItem";

export default function SiteDetailsPage() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    // console.log('siteID', {siteID, site, use: useParams()});




    return (
        <>
        <Header/>
        <main className='container'>
            <h2>Site Details- Incomplete</h2>

            <div className="d-flex justify-content-between">
                <div>
                    <Button variant='outline-secondary'>&lt; Back</Button>
                    <span>{site.siteID} - {site.address}</span>
                </div>
                <div>
                    <Button variant='secondary'>Edit</Button>
                    <Button variant='secondary'>Delete</Button>
                </div>
            </div>

            <div className={styles.metadata}>
                <h4>Site Location</h4>

                <div className={styles.metadataGrid}>
                    <div className={styles.metadataGridItem}>
                        <div className={styles.formLabel}>Site ID</div>
                        <div>{site.siteID}</div>
                    </div>
                    {/* <FlexRowItem label='Site ID'>{site.siteID}</FlexRowItem>
                    <FlexRowItem label='Victoria File'>{site.victoriaFile}</FlexRowItem> */}

                    <div className={styles.metadataGridItem}>
                        <div className={styles.formLabel}>Victoria File</div>
                        <div>{site.victoriaFile}</div>
                    </div>

                    <div className={styles.metadataGridItem}>
                        <div className={styles.formLabel}>Regional File</div>
                        <div>{site.regionalFile}</div>
                    </div>

                    <div className={styles.metadataGridItem}>
                        <div className={styles.formLabel}>Address File</div>
                        <div>{site.address}</div>
                    </div>

                    <div className={styles.metadataGridItem}>
                        <div className={styles.formLabel}>Region</div>
                        <div>{site.region}</div>
                    </div>

                    <div className={styles.metadataGridItem + " " + styles.gridHalfWidth}>
                        <div className={styles.formLabel}>Latitude</div>
                        <div>{site.latitude}</div>
                    </div>

                    <div className={styles.metadataGridItem + " " + styles.gridHalfWidth}>
                        <div className={styles.formLabel}>Longitude</div>
                        <div>{site.longitude}</div>
                    </div>



                    <div className={styles.metadataGridItem + " " +  styles.gridFullwidth}>
                        <div className={styles.formLabel}>Parcel IDs</div>
                        <div>{site.victoriaFile}</div>
                    </div>

                    <div className={styles.metadataGridItem + " " + styles.gridFullwidth}>
                        <div className={styles.formLabel}>Location Description</div>
                        <div>{site.locationDescription}</div>
                    </div>
                </div>
            </div>
            
        </main>
        </>
    )
}