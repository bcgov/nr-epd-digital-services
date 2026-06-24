import { useEffect } from 'react';
import { Icon, LatLng, LatLngBounds, marker as leafletMarker } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  Circle,
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
} from 'react-leaflet';
import {
  getDefaultZoom,
  getMapCenter,
  hasChefsMapFeatures,
  parseChefsMapValue,
  toFeatureCollection,
} from './chefsMapTypes';
import 'leaflet/dist/leaflet.css';
import './ChefsMapViewer.css';

const mapMarkerIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type ChefsMapViewerProps = {
  value: unknown;
};

function FitMapToFeatures({
  collection,
}: {
  collection: GeoJSON.FeatureCollection;
}) {
  const map = useMap();

  useEffect(() => {
    if (collection.features.length === 0) {
      return;
    }

    const bounds = new LatLngBounds([]);
    collection.features.forEach((feature) => {
      const geometry = feature.geometry;
      if (!geometry) {
        return;
      }

      if (geometry.type === 'Point') {
        const [lng, lat] = geometry.coordinates;
        bounds.extend([lat, lng]);

        const radius = feature.properties?.radius;
        if (typeof radius === 'number' && radius > 0) {
          const radiusDeg = radius / 111_320;
          bounds.extend([lat + radiusDeg, lng + radiusDeg]);
          bounds.extend([lat - radiusDeg, lng - radiusDeg]);
        }
        return;
      }

      const flattenCoords = (coords: unknown): void => {
        if (!Array.isArray(coords)) {
          return;
        }
        if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
          bounds.extend([coords[1] as number, coords[0] as number]);
          return;
        }
        coords.forEach(flattenCoords);
      };

      flattenCoords(geometry.coordinates);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 });
    }
  }, [collection, map]);

  return null;
}

const geoJsonPointToLayer = (
  feature: GeoJSON.Feature,
  latlng: LatLng,
) => {
  if (feature.properties?.chefsType === 'circle') {
    return leafletMarker(latlng, { icon: mapMarkerIcon });
  }
  return leafletMarker(latlng, { icon: mapMarkerIcon });
};

function ChefsCircleOverlays({
  collection,
}: {
  collection: GeoJSON.FeatureCollection;
}) {
  return (
    <>
      {collection.features.map((feature, index) => {
        if (
          feature.properties?.chefsType !== 'circle' ||
          feature.geometry?.type !== 'Point' ||
          typeof feature.properties.radius !== 'number'
        ) {
          return null;
        }

        const [lng, lat] = feature.geometry.coordinates;
        return (
          <Circle
            key={`chefs-circle-${index}`}
            center={[lat, lng]}
            radius={feature.properties.radius}
            pathOptions={{ color: '#003366', fillOpacity: 0.15 }}
          />
        );
      })}
    </>
  );
}

export function ChefsMapViewer({ value }: ChefsMapViewerProps) {
  const parsed = parseChefsMapValue(value);
  const collection = parsed ? toFeatureCollection(parsed) : null;
  const hasRawFeatures = parsed ? hasChefsMapFeatures(parsed) : false;
  const hasDrawableFeatures = (collection?.features.length ?? 0) > 0;
  const center = collection
    ? getMapCenter(collection)
    : getMapCenter({ type: 'FeatureCollection', features: [] });
  const zoom = getDefaultZoom(collection?.features.length ?? 0);

  if (!parsed) {
    return (
      <p className="chefs-map-empty" role="status">
        No map data available.
      </p>
    );
  }

  return (
    <div className="chefs-map-viewer">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="chefs-map-viewer__map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasDrawableFeatures && collection && (
          <>
            <GeoJSON
              data={collection}
              pointToLayer={geoJsonPointToLayer}
              style={() => ({ color: '#003366', weight: 2, fillOpacity: 0.15 })}
            />
            <ChefsCircleOverlays collection={collection} />
            <FitMapToFeatures collection={collection} />
          </>
        )}
      </MapContainer>
      {!hasRawFeatures && (
        <p className="chefs-map-empty chefs-map-empty--overlay" role="status">
          No location was selected on the map.
        </p>
      )}
    </div>
  );
}
