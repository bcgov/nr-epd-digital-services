import { MapContainer, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import styles from './css/summary.module.css'
import { Site } from "@/api/sites";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Link, useParams } from "react-router-dom";
// import 'leaflet/dist/leaflet.css'; //Unsure if necessary after included in map.tsx

export default function Summary() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));


    return (
        <div>
            <div className="row">
                <div className="col-md-9">
                    <MapContainer zoom={13} zoomControl={false} center={[site.latitude, site.longitude]} className={styles.mapContainer} dragging={false} touchZoom={false} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <WMSTileLayer
                            url="https://openmaps.gov.bc.ca/geo/pub/ows"
                            layers="pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_FA_SVW"
                            transparent={true}
                            format="image/png"
                        />

                        <Marker
                            position={[site.latitude, site.longitude]}
                        ></Marker>



                    </MapContainer>
                </div>
                <div className="col-md-3 border border-1 border-secondary rounded p-4">
                    <p><span className="fw-bolder">Notations</span>: {site.notations.length} </p>
                    <p><span className="fw-bolder">Participants</span>: {site.participants.length} </p>
                    <p><span className="fw-bolder">Associated Sites</span>: {site.associatedSites.length} </p>
                    <p><span className="fw-bolder">Documents</span>: todo</p>
                    <p><span className="fw-bolder">Suspect Land Use</span>: {site.suspectLandUses.length}</p>
                    <p><span className="fw-bolder">Parcel Description</span>: {site.parcelDescriptions.length}</p>


                    <Link className='text-decoration-none' to={`/map?siteID=${site.siteID}`}>View on Map</Link>
                </div>
            </div>
        </div>
    )
}