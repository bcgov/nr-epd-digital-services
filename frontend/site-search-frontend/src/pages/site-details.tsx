import { Site } from "@/api/sites";
import Header from "@/components/Header"
import { RootState } from "@/store";
import { Button, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import styles from './site-details.module.css'
import SiteGridItem from "@/features/site-details/SiteGridItem";
import { useState } from "react";
import { toggleEdit } from '@/features/site-details/edit-mode/editModeSlice';
import { formatLatLng } from "@/helpers/formatLatLng";

export default function SiteDetailsPage() {
    const { siteID } = useParams();
    const editMode = useSelector((state: RootState) => state.edit.editMode)
    const siteIDNum = parseInt(siteID);
    const location = useLocation();
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));
    const dispatch = useDispatch();

    function toggleEditClick(){
        dispatch(toggleEdit())
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
                        <Button className='mx-3' variant='secondary' onClick={toggleEditClick}>Edit</Button>
                        <Button variant='warning'>Delete</Button>
                    </div>}
                    {editMode && <div>
                        <Button variant='primary' className='mx-4' onClick={toggleEditClick}>Save</Button>
                        <Button variant='secondary' onClick={toggleEditClick}>Cancel</Button>
                    </div>}
                </div>

                <div className={styles.metadata}>
                    <h4>Site Location</h4>

                    <div className={styles.metadataGrid}>
                        <SiteGridItem label='Site ID' value={site.siteID}  />
                        <SiteGridItem label='Victoria File' value={site.victoriaFile}   />
                        <SiteGridItem label='Regional File' value={site.regionalFile}   />
                        <SiteGridItem label='Address' value={site.address}  />
                        <SiteGridItem label='Region' value={site.region}  />

                        <SiteGridItem label='Latitude' value={formatLatLng(site.latitude)} extraClasses={styles.gridHalfWidth}   />
                        <SiteGridItem label='Longitude' value={formatLatLng(site.longitude)} extraClasses={styles.gridHalfWidth}   />

                        <SiteGridItem label='Parcel IDs' value={site.parcelIDs.join(', ')} extraClasses={styles.gridFullwidth}   />
                        <SiteGridItem label='Location Description' value={site.locationDescription} extraClasses={styles.gridFullwidth} readOnly={true} />
                    </div>
                </div>


                <div className={styles.metadata}>
                    {/* defaultActiveKey depends on eventKeys matching the same as the `to` field */}
                    <Nav variant="pills" defaultActiveKey={location.pathname} className='mb-4'>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/`} eventKey={`/site/${siteID}/`} >Summary</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/notations/`} eventKey={`/site/${siteID}/notations/`}>Notations</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/participants/`} eventKey={`/site/${siteID}/participants/`} >Site Participants</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/documents/`} eventKey={`/site/${siteID}/documents/`}>Documents</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/associated-sites/`} eventKey={`/site/${siteID}/associated-sites/`}>Associated Sites</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/suspect-land-uses/`} eventKey={`/site/${siteID}/suspect-land-uses/`}>Suspect Land Uses</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/parcel-description/`} eventKey={`/site/${siteID}/parcel-description/`}>Parcel Description</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={`/site/${siteID}/site-profile/`} eventKey={`/site/${siteID}/site-profile/`}>Site Disclosure</Nav.Link>
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