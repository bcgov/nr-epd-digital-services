import { MapContainer, Marker, Popup } from "react-leaflet";
import { TileLayer, WMSTileLayer, useMapEvents,Rectangle,Pane } from "react-leaflet";
import { useMap  } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";

import React, { useEffect, useState } from "react";

const Map = (props) => {
  let map;
  let routeLayer, waypointsLayer;
  const identifyBufferDistance = 4;
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState([ 48.46762, -123.25458  ]);
  const [zoom, setZoom] = useState(13);
  const [searchTrue, setSerachTrue] = useState(true);
  //const [info, setInfo] = useState({});
  let info;

  useEffect(() => {
    if (props.initLocation.length > 0 && props.initLocation !== null && props.initLocation !== undefined && ( location[0] !== props.initLocation[0] ||   location[1] !== props.initLocation[1]   )) {
     
     

      const timeoutId =  setTimeout(()=>{
        //setSerachTrue(false);
        setZoom(18);
        setLocation(props.initLocation);
        if(!props.readOnly)
        {
          setShow(true);
        } 

      },1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [props]);

  const overlayLayerDetails = [
    {
      name: "Ski Resorts",
      layer: "pub:WHSE_IMAGERY_AND_BASE_MAPS.GSR_SKI_RESORTS_SV",
      featureIdPrefix: "WHSE_IMAGERY_AND_BASE_MAPS.GSR_SKI_RESORTS_SV.fid",
      visible: true,
      topLineProperty: "OCCUPANT_TYPE_DESCRIPTION",
      bottomLineProperty: "FACILITY_NAME",
    },
    {
      name: "Environmental Remediation Sites",
      layer: "pub:WHSE_WASTE.SITE_ENV_RMDTN_SITES_SVW",
      featureIdPrefix: "WHSE_WASTE.SITE_ENV_RMDTN_SITES_SVW.fid",
      visible: true,
      topLineProperty: "SITE_ID",
      latitude: "LATITUDE",
      longitude: "LONGITUDE",
      bottomLineProperty: "ADDRESS",
    },
    {
      name: "ParcelMap BC Parcel Polygons",
      layer: "pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW",
      featureIdPrefix: "WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW.fid",
      visible: true,
      topLineProperty: "PID",
      parcelName: "PARCEL_NAME",
      municipality: "MUNICIPALITY",
      bottomLineProperty: "PIN",
    },
    {
      name: "Golf Courses",
      layer: "pub:WHSE_IMAGERY_AND_BASE_MAPS.GSR_GOLF_COURSES_SV",
      featureIdPrefix: "WHSE_IMAGERY_AND_BASE_MAPS.GSR_GOLF_COURSES_SV.fid",
      visible: true,
      topLineProperty: "FACILITY_NAME",
      bottomLineProperty: "PHYSICAL_ADDRESS",
    },
  ];

  function MyComponent() {
    const map = useMapEvents({
      click(e) {
        //e.preventDefault()
        //setLocation([e.latlng.lat, e.latlng.lng]);
        const visibleLayers = overlayLayerDetails.filter((ol) => ol.visible);

        console.log("visibleLayers", visibleLayers);
        console.log("overlayLayerDetails", overlayLayerDetails);

        if (visibleLayers.length) {
          // WMS query requires the layers to be specified comma separated
          const visibleLayersCSV = visibleLayers.map((vl) => vl.layer).join();

          // WMS GetFeatureInfo queries are awkward as there is by default no
          // way to specify a pixel tolerance. Here we are doing something similar
          // to what QGIS does, shrinking the bbox to the bounds of our pixel tolerance
          // and then specifying tiny image size and screen coordinates.
          const mapDistanceDiag = map
            .getBounds()
            .getSouthWest()
            .distanceTo(map.getBounds().getNorthEast());
          const mapSizeDiag = Math.sqrt(
            Math.pow(map.getSize().x, 2) + Math.pow(map.getSize().y, 2)
          );
          const metresPerPixel = mapDistanceDiag / mapSizeDiag;
          const bufferedClickLocation = e.latlng.toBounds(
            metresPerPixel * identifyBufferDistance
          );
          const bbox =
            bufferedClickLocation.getSouth() +
            "," +
            bufferedClickLocation.getWest() +
            "," +
            bufferedClickLocation.getNorth() +
            "," +
            bufferedClickLocation.getEast();

          // This is clearly not an appropriate way of doing GetFeatureInfo queries
          // in a production application since we have hard-coded the URL and the
          // parameters which would normally be detected at runtime and/or configured
          // in an external file.
          console.log(visibleLayersCSV);
          const getFeatureInfoUrl =
            "https://openmaps.gov.bc.ca/geo/pub/ows" +
            L.Util.getParamString(
              {
                service: "WMS",
                version: "1.3.0",
                request: "GetFeatureInfo",
                crs: "EPSG:4326",
                styles: "",
                format: "image/png",
                info_format: "application/json",
                feature_count: "1",
                layers: visibleLayersCSV,
                query_layers: visibleLayersCSV,
                i: 0,
                j: 1,
                width: 2,
                height: 2,
                bbox: bbox,
              },
              "",
              true
            );

          console.log("getFeatureInfoUrl--", getFeatureInfoUrl);

          fetch(getFeatureInfoUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data.features.length > 0) {
                const feature = data.features[0];

                // Identify which layer the feature came from. This is, like the
                // hard-coded URL construction above, not appropriate for production
                // but inspecting the returned feature ID is a quick way of
                // identifying which layer our feature came from, for our 2 select bcgw
                // WMS layers anyhow. There are better ways of doing this that are more
                // flexible for other layer sources.
                const targetLayer = visibleLayers.find(
                  (vl) => feature.id.indexOf(vl.featureIdPrefix) > -1
                );
                console.log("targetLayer---", targetLayer?.layer);
                console.log("data.features---", data.features);
                if (
                  targetLayer != null &&
                  targetLayer?.layer ===
                    "pub:WHSE_WASTE.SITE_ENV_RMDTN_SITES_SVW"
                ) {
                  info = {
                    type: "siteId",
                    id: feature.properties[targetLayer.topLineProperty],
                    lat: e.latlng.lat,
                    long: e.latlng.lng,
                    address: feature.properties[targetLayer.bottomLineProperty],
                  };
                  L.popup()
                    .setLatLng(e.latlng)
                    .setContent(
                      "Site ID:" +
                        feature.properties[targetLayer.tsopLineProperty] +
                        "<br/>" +
                        "Lat: " +
                        feature.properties[targetLayer.latitude] +
                        "," +
                        "Lng: " +
                        feature.properties[targetLayer.longitude] +
                        "<br/>" +
                        "Address: " +
                        feature.properties[targetLayer.bottomLineProperty]
                    )
                    .openOn(map);
                } else if (
                  targetLayer?.layer ===
                  "pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW"
                ) {
                  info = {
                    type: "pid",
                    id: feature.properties[targetLayer.topLineProperty],
                    lat: e.latlng.lat,
                    long: e.latlng.lng,
                    pin: feature.properties[targetLayer.bottomLineProperty],
                    municipality: feature.properties[targetLayer.municipality],
                  };
                  L.popup()
                    .setLatLng(e.latlng)
                    .setContent(
                      "PID:" +
                        feature.properties[targetLayer.topLineProperty] +
                        "<br/>" +
                        "Lat: " +
                        e.latlng.lat +
                        "," +
                        "Lng: " +
                        e.latlng.lng +
                        "<br/>" +
                        "PIN: " +
                        feature.properties[targetLayer.bottomLineProperty] +
                        "<br/>" +
                        "Municipality: " +
                        feature.properties[targetLayer.municipality]
                    )

                    .openOn(map);
                } else {
                  console.log("Could not match result to any layer");
                  console.log("Feature ID: " + feature.id);
                }
              } else {
                info = {
                  type: "pid",

                  lat: e.latlng.lat,
                  long: e.latlng.lng,
                };

                // If the user clicked a location where there are no features, show
                // the cursor location in a popup for courtesy.
                L.popup()
                  .setLatLng(e.latlng)
                  .setContent(
                    e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5)
                  )
                  .openOn(map);
              }
            })
            .catch((error) =>
              console.error("Could not fetch WMS features", error)
            );
        } else {
          // If there are none of our overlay layers visible, just show the
          // current location where they clicked in a popup so the user knows
          // at least something is happening.
          L.popup()
            .setLatLng(e.latlng)
            .setContent(
              e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5)
            )
            .openOn(map);
        }
      },
      overlayadd(e) {
        //When a layer is toggled on from the layer control, set visibility
        //to true in the layer details array
        const layerDetails = overlayLayerDetails.find(
          (ol) => ol.name === e.name
        );
        layerDetails.visible = true;
      },
      overlayremove(e) {
        //When a layer is toggled off from the layer control, set visibility
        //to false in the layer details array
        const layerDetails = overlayLayerDetails.find(
          (ol) => ol.name === e.name
        );
        layerDetails.visible = false;
      },
    });

    // return null;
    //   click: () => {
    //     map.locate()
    //   },
    //   locationfound: (location) => {
    //     console.log('location found:', location)
    //   },
    // })
    return null;
  }

  const toggleModal = () => {
    // console.log("show", address);
    // setShow(!show);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setAddress(e.target.value);
  };

  const handleSubmit = () => {
    getGeoCode(address).then((x) => {
      if (x.features.length > 0) {
        console.log(x.features[0].geometry.coordinates);
        setZoom(20);
        setLocation([
          x.features[0].geometry.coordinates[1],
          x.features[0].geometry.coordinates[0],
        ]);
        setSerachTrue(true);
      }
    });
  };

  const print = () => {
    console.log("info", info);
    if (props.callback !== null && props.callback !== undefined) {
      props.callback(info);
    }
  };

  const GEOCODER_API_URL = "https://geocoder.api.gov.bc.ca/addresses.json";
  const GEOCODER_API_MINSCORE = 50;
  const GEOCODER_API_MAX_RESULTS = 1;
  const GEOCODER_API_AUTOCOMPLETE = true;

  const OUTPUT_SRS = "4326";

  const getGeoCode = (addressQuery) => {
    var queryParams = new URLSearchParams();
    queryParams.set("maxResults", GEOCODER_API_MAX_RESULTS);
    queryParams.set("autoComplete", GEOCODER_API_AUTOCOMPLETE);
    queryParams.set("minScore", GEOCODER_API_MINSCORE);
    queryParams.set("outputSRS", OUTPUT_SRS);
    queryParams.set("addressString", addressQuery);

    return fetch(`${GEOCODER_API_URL}?${queryParams.toString()}`).then((resp) =>
      resp.json()
    );
  };

  const maxBounds = [
    [46.5, -139.1], // Southwest corner
    [60.0, -114.0], // Northeast corner
  ];

  const RecenterAutomatically = () => {
    const map = useMap();
    useEffect(() => {    
      map.setZoom(zoom);
      
      if(searchTrue)
      {
      map.setView(location,zoom);
      }
     
      map.fire("click", {
        latlng: L.latLng(location),
      });

    }, [map]);
    return null;
  };

  return (
    <div style={{ padding: "1%" }}>
      <div>
        {/* <a href="#" onClick={() => toggleModal()}>
          Search Address
        </a> */}
        <h3>Search Address</h3>

        {console.log("r", show)}
        {show && (
          <div>
            <div>
              <input
                type="text"
                style={
                  {
                    "display": "inline-block",
                    "padding": ".375rem",
                    "fontSize": "1rem",
                    "lineHeight":"0.5",
                    "color": "#495057",
                   "backgroundColor":" #fff",
                   "backgroundClip": "padding-box",
                   "border": "1px solid #ced4da",
                   " borderRadius": ".25rem"
                  }
                } 
                value={address}
                placeholder="Type address "
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
              <input
                type="button"
                style={{
                  "fontSize": ".875rem",                
                  "padding": ".375rem",
                  "borderRadius": ".2rem",
                  "cursor": "pointer",
                  "color": "#fff",
                  "backgroundColor": "#007bff",
                  "borderColor": "#007bff",
                  "marginLeft" : "5px"
                }}
                onClick={() => {
                  handleSubmit();
                }}
                value="Search"
              ></input>
            </div>
            <br />
            <div>
              <input
              
                style={{
                  "fontSize": ".875rem",
                  "lineHeight": "1.5",
                  "borderRadius": ".2rem",
                  "cursor": "pointer",
                  "color": "#fff",
                  "backgroundColor": "#28a745",
                  "borderColor": "#28a745",

                }}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  print();
                }}
                value="Select the marked location in map"
              ></input>
            </div>
          </div>
        )}
      </div>
      <br />
      <MapContainer center={location}  zoom={zoom} minZoom={10}  maxBounds={maxBounds} bounds={maxBounds} maxBoundsViscosity={1.0} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <WMSTileLayer
          url="https://openmaps.gov.bc.ca/geo/pub/ows"
          layers="pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW"
          transparent={true}
          format="image/png"
        />  */}
         <WMSTileLayer
          url="https://openmaps.gov.bc.ca/geo/pub/ows"                      
          layers="pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_FA_SVW" 
          transparent={true}
          format="image/png"
        /> 
      
     
        <MyComponent />
        {/* <Marker position={[-123.3599322,48.4433726]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[48.4433726,-123.3599322]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
        {/* <Marker
          position={location}
          icon={
            new Icon({
              iconUrl: markerIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        /> */}
        <RecenterAutomatically></RecenterAutomatically>
      </MapContainer>
    </div>
  );
};

export default Map;
