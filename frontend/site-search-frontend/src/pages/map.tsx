import Header from "@/components/Header"
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import { MapContainer, WMSTileLayer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useLocation } from "react-router-dom";
import { Site } from "@/api/sites";
import { useSelector } from "react-redux";
import { LatLngExpression } from "leaflet";
import CloseButton from 'react-bootstrap/CloseButton';
import MapDetailsPane from "@/features/map/MapDetailsPane";




export default function MapPage() {
    const [location, setLocation] = useState<LatLngExpression>([48.46762, -123.25458]);
    const {state} = useLocation();
    // const { routerSearchQuery } = state; // Read values passed on state
    const routerSearchQuery = state && state.routerSearchQuery || '';
    const [searchQuery, setSearchQuery] = useState(routerSearchQuery);

    const [selectedSite, setSelectedSite] = useState<Site | null>();

    const sites: Site[] = useSelector(state => state.site.value);

    function onMarkerClick(e){
        console.log('onMarkerClick', e);
        const clickedSite = e?.target?.options?.site;
        if (clickedSite) {
            setSelectedSite(clickedSite)
        }
    }

    function clearSelection(){
        setSelectedSite(null);
    }

    return (
        <>
            <Header />
            <main>
                <div className={styles.controls}>
                    <div className="d-flex justify-content-between">

                        <div className='d-flex'>
                            <input type="text" className={styles.mapSearch + " form-control"} placeholder="Search site records..." value={searchQuery} onChange={setSearchQuery}/>

                            <Button className='ms-4' variant="secondary">Vector</Button>
                            <Button className='mx-3' variant="secondary">Pin</Button>
                        </div>
                        <div className="d-flex">
                            <Dropdown className='mx-3'>
                                <Dropdown.Toggle variant="secondary" id="dropdown-data-layers">
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


                {/* TODO: Split this to it's own component */}
                {/* <div className={styles.detailsPane}>
                    <div className="d-flex justify-content-between">
                        <span>&gt; Back</span>
                        <CloseButton />
                    </div>

                    <span className="fst-italic">Last Updated: </span>
                </div> */}
                {/* {selectedSite && <MapDetailsPane site={selectedSite} onClose={clearSelection} />} */}
                {/* <MapDetailsPane className={selectedSite ? 'fadeIn' : 'fadeOut'} site={selectedSite} onClose={clearSelection} /> */}
                <MapDetailsPane site={selectedSite} onClose={clearSelection} />

                {/* !!searchQuery.length ? 'fadeIn' : 'fadeOut' */}
 

                {/* <MapContainer center={location} zoom={13} style={{height: "calc(100vh-160px)", width: "100vw"}} > */}
                {/* <MapContainer center={location} zoom={13} style={{height: "100vh", width: "100vw"}} > */}
                <MapContainer center={location} zoom={8} className={styles.mapContainer} zoomControl={false} >


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

                    <ZoomControl position='bottomleft' />

                    
                    {/* Add all sites as map markers */}

                    {sites.map(site => {
                        return <Marker 
                            position={[site.latitude, site.longitude]}
                            key={site.uuid}
                            eventHandlers={{ click: onMarkerClick }}
                            site={site}
                        ></Marker>
                    })}


                </MapContainer>

            </main>
        </>
    )
}