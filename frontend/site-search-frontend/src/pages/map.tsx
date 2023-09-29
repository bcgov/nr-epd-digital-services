import Header from "@/components/Header"
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { MapContainer, WMSTileLayer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useLocation, useSearchParams } from "react-router-dom";
import { Site } from "@/api/sites";
import { useSelector } from "react-redux";
import { LatLngExpression } from "leaflet";
import MapDetailsPane from "@/features/map/MapDetailsPane";
import { RootState } from "@/store";
import UpdateMapCentre from "@/features/map/UpdateMapCentre";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

L.marker.prototype.options.icon = DefaultIcon;


export default function MapPage() {
    const [location, setLocation] = useState<LatLngExpression>([48.46762, -123.25458]);
    const { state } = useLocation();
    const routerSearchQuery = state && state.routerSearchQuery || '';
    const [searchQuery, setSearchQuery] = useState(routerSearchQuery);
    const [zoom, setZoom] = useState<number>(8)
    // Note: Potentially replace this with the State selector? selection.ts
    const [selectedSite, setSelectedSite] = useState<Site | null>();
    const sites: Site[] = useSelector((state: RootState) => state.site.value);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const siteIDParam = searchParams.get('siteID')
        const site = sites.find(site => site.siteID.toString() == siteIDParam);

        if (site) {
            focusOnSite(site);
            setZoom(14);
            setSelectedSite(site);
        }
    }, [searchParams])



    function onMarkerClick(e) {
        // console.log('onMarkerClick', e);
        const clickedSite: Site = e?.target?.options["data-site"];
        if (clickedSite) {
            searchParams.set('siteID', clickedSite.siteID.toString());
            setSearchParams(searchParams);
            focusOnSite(clickedSite);
            setSelectedSite(clickedSite)
        }
    }

    function clearSelection() {
        setSelectedSite(null);
    }

    function focusOnSite(site: Site) {
        setLocation([site.latitude, site.longitude])
        // setZoom(10)
    }

    function onLayerClick(e) {
        console.log('onLayerClick', { e })
    }

    return (
        <>
            <Header />
            <main>
                <div className={styles.controls}>
                    <div className="d-flex justify-content-between">

                        <div className='d-flex'>
                            <input type="text" className={styles.mapSearch + " form-control"} placeholder="Search site records..." value={searchQuery} onChange={setSearchQuery} />

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



                <MapDetailsPane site={selectedSite} onClose={clearSelection} />
                <MapContainer center={location} zoom={8} className={styles.mapContainer} zoomControl={false} >
                    <UpdateMapCentre mapCentre={location} zoom={zoom} />


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
                            data-site={site}
                        ></Marker>
                    })}


                </MapContainer>

            </main>
        </>
    )
}