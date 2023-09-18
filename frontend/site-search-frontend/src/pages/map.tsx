import Header from "@/components/Header"
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import { MapContainer, WMSTileLayer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';


export default function MapPage() {
    const [location, setLocation] = useState([ 48.46762, -123.25458  ]);

    return (
        <>
            <Header />
            <main className=''>

                <div className={styles.controls + " row"}>
                    <div className='col-8 d-flex'>
                        <input type="text" className="form-control d-inline-block" />

                        <Button variant="secondary-outline">Vector</Button>
                        <Button variant="secondary-outline">Pin</Button>
                    </div>
                    <div className="col">
                        <Button>Dropdown here</Button>
                        <Button>Map/List Toggle here</Button>
                    </div>
                </div>

                <p></p>

                {/* <MapContainer center={location} zoom={13} style={{height: "calc(100vh-160px)", width: "100vw"}} > */}
                {/* <MapContainer center={location} zoom={13} style={{height: "100vh", width: "100vw"}} > */}
                <MapContainer center={location} zoom={13} className={styles.mapContainer} >


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


                </MapContainer>

            </main>
        </>
    )
}