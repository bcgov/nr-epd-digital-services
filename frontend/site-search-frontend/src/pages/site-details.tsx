import { Site } from "@/api/sites";
import Header from "@/components/Header"
import { RootState } from "@/store";
import { Button, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, Outlet, useParams } from "react-router-dom";
import styles from './site-details.module.css'
import SiteGridItem from "@/features/site-details/SiteGridItem";
import { useState } from "react";

export default function SiteDetailsPage() {
    const { siteID } = useParams();

    // Todo: Move 'Edit Mode' to redux, same with staff role stuff.
    const [editMode, setEditMode] = useState(false);
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));

    function toggleEdit(){
        setEditMode(!editMode)
    }


    return (
        <>
            <Header />
            <main className='container mt-3'>

                <div className="d-flex justify-content-between">
                    <div>
                        <Button className='me-3' variant='outline-secondary' onClick={() => { history.back() }}>&lt; Back</Button>
                        <span className="fw-bolder">{site.siteID} - {site.address}</span>
                    </div>
                    {!editMode && <div>
                        <Button className='mx-3' variant='secondary' onClick={toggleEdit}>Edit</Button>
                        <Button variant='secondary'>Delete</Button>
                    </div>}
                    {editMode && <div>
                        Editting...
                        <Button variant='secondary' onClick={toggleEdit}>Done</Button>
                    </div>}
                </div>

                <div className={styles.metadata}>
                    <h4>Site Location</h4>

                    <div className={styles.metadataGrid}>
                        <SiteGridItem label='Site ID' value={site.siteID} editMode={editMode} />
                        <SiteGridItem label='Victoria File' value={site.victoriaFile} editMode={editMode}  />
                        <SiteGridItem label='Regional File' value={site.regionalFile} editMode={editMode}  />
                        <SiteGridItem label='Address' value={site.address} editMode={editMode} />
                        <SiteGridItem label='Region' value={site.region} editMode={editMode} />

                        <SiteGridItem label='Latitude' value={site.latitude} extraClasses={styles.gridHalfWidth} editMode={editMode}  />
                        <SiteGridItem label='Longitude' value={site.longitude} extraClasses={styles.gridHalfWidth} editMode={editMode}  />

                        <SiteGridItem label='Parcel IDs' value={site.parcelIDs.join(', ')} extraClasses={styles.gridFullwidth} editMode={editMode}  />
                        <SiteGridItem label='Location Description' value={site.locationDescription} extraClasses={styles.gridFullwidth} editMode={editMode}  />
                    </div>
                </div>


                <div className={styles.metadata}>
                    {/* TODO: Fix defaultActiveKey to work on refresh based on URL. Currently it requires state that is lost on refresh. */}
                    <Nav variant="pills" defaultActiveKey="link-0" className='mb-4'>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/`} eventKey="link-0">Summary</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/notations/`} eventKey="link-1">Notations</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/participants/`} eventKey="link-2">Site Participants</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/documents/`} eventKey="link-3">Documents</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/associated-sites/`} eventKey="link-4">Associated Sites</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/suspect-land-uses/`} eventKey="link-5">Suspect Land Uses</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/parcel-description/`} eventKey="link-6">Parcel Description</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/site-profile/`} eventKey="link-7">Site Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/activity-log/`} eventKey="link-8">Activity Log</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Outlet />
                </div>

            </main>
        </>
    )
}