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
                    <span>{site.address}</span>
                </div>
                <div>
                    <Button variant='secondary'>Edit</Button>
                    <Button variant='secondary'>Delete</Button>
                </div>
            </div>

            <div className={styles.metadata}>
                <h4>Site Location</h4>

                <div className="d-flex">
                    <FlexRowItem label='Site ID'>{site.siteID}</FlexRowItem>
                </div>
            </div>
            
        </main>
        </>
    )
}