import Header from "@/components/Header"
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import { MapContainer, WMSTileLayer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';



export default function MapPage() {
    const [location, setLocation] = useState([48.46762, -123.25458]);

    return (
        <>
            <Header />
            <main>
                <div className={styles.controls}>
                    <div className="d-flex justify-content-between">

                        <div className='d-flex'>
                            <input type="text" className={styles.mapSearch + " form-control"} placeholder="Search site records..." />

                            <Button className='ms-4' variant="secondary">Vector</Button>
                            <Button className='mx-3' variant="secondary">Pin</Button>
                        </div>
                        <div className="d-flex">
                            <Dropdown className='mx-3'>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    Data Layers
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item>todo</Dropdown.Item>
                                    <Dropdown.Item>todo</Dropdown.Item>
                                    <Dropdown.Item>todo</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* <Button>Map/List Toggle here</Button> */}
                            <ButtonGroup>
                                <ToggleButton variant='secondary' value="false">
                                    Map
                                </ToggleButton>
                                <ToggleButton variant='primary' value="1">
                                    List
                                </ToggleButton>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>

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