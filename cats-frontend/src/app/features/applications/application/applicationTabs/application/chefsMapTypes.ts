/** CHEFS map field value shape (drawn features + base layer metadata). */
export type ChefsMapValue = {
  features?: unknown[];
  selectedBaseLayer?: string;
};

export type LatLngTuple = [number, number];

const DEFAULT_CENTER: LatLngTuple = [48.4284, -123.3656];

/** CHEFS drawn feature — not standard GeoJSON (see bcgov/common-hosted-form-service Map component). */
export type ChefsDrawnFeature = {
  type?: string;
  coordinates?: unknown;
  bounds?: unknown;
  radius?: number;
};

export function parseChefsMapValue(value: unknown): ChefsMapValue | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.features)) {
    return null;
  }
  return {
    features: record.features,
    selectedBaseLayer:
      typeof record.selectedBaseLayer === 'string'
        ? record.selectedBaseLayer
        : undefined,
  };
}

export function hasChefsMapFeatures(value: ChefsMapValue): boolean {
  return (value.features?.length ?? 0) > 0;
}

/** Parse CHEFS / Leaflet lat-lng ({ lat, lng } or "lat,lng" string). */
export function parseLatLng(coords: unknown): LatLngTuple | null {
  if (coords == null) {
    return null;
  }

  if (typeof coords === 'object') {
    const record = coords as Record<string, unknown>;
    const lat = Number(record.lat);
    const lng = Number(record.lng);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return [lat, lng];
    }
  }

  if (typeof coords === 'string') {
    const parts = coords.split(',').map((part) => parseFloat(part.trim()));
    if (
      parts.length >= 2 &&
      !Number.isNaN(parts[0]) &&
      !Number.isNaN(parts[1])
    ) {
      return [parts[0], parts[1]];
    }
  }

  return null;
}

function parseBounds(
  bounds: unknown,
): { southWest: LatLngTuple; northEast: LatLngTuple } | null {
  if (!bounds) {
    return null;
  }

  if (typeof bounds === 'string') {
    const parts = bounds.split(',').map((part) => parseFloat(part.trim()));
    if (parts.length >= 4 && parts.every((n) => !Number.isNaN(n))) {
      return {
        southWest: [parts[0], parts[1]],
        northEast: [parts[2], parts[3]],
      };
    }
    return null;
  }

  if (typeof bounds === 'object') {
    const record = bounds as Record<string, unknown>;
    const sw = parseLatLng(record._southWest);
    const ne = parseLatLng(record._northEast);
    if (sw && ne) {
      return { southWest: sw, northEast: ne };
    }
  }

  return null;
}

function latLngRingToGeoJson(ring: LatLngTuple[]): number[][] {
  return ring.map(([lat, lng]) => [lng, lat]);
}

function flattenLatLngs(coords: unknown): LatLngTuple[] {
  if (!Array.isArray(coords)) {
    const point = parseLatLng(coords);
    return point ? [point] : [];
  }

  return coords.flatMap((item) => flattenLatLngs(item));
}

function isGeoJsonFeature(value: unknown): value is GeoJSON.Feature {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const feature = value as GeoJSON.Feature;
  return feature.type === 'Feature' && feature.geometry != null;
}

/**
 * Convert a CHEFS drawn feature (marker, polygon, etc.) to GeoJSON for Leaflet.
 */
export function chefsFeatureToGeoJson(feature: unknown): GeoJSON.Feature | null {
  if (isGeoJsonFeature(feature)) {
    return feature;
  }

  if (!feature || typeof feature !== 'object') {
    return null;
  }

  const drawn = feature as ChefsDrawnFeature;
  const chefsType = String(drawn.type ?? '').toLowerCase();

  if (chefsType === 'marker' || chefsType === 'circle') {
    const latLng = parseLatLng(drawn.coordinates);
    if (!latLng) {
      return null;
    }
    const [lat, lng] = latLng;
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: {
        chefsType,
        ...(typeof drawn.radius === 'number' ? { radius: drawn.radius } : {}),
      },
    };
  }

  if (chefsType === 'rectangle') {
    const bounds = parseBounds(drawn.bounds);
    if (!bounds) {
      return null;
    }
    const { southWest, northEast } = bounds;
    const ring: LatLngTuple[] = [
      southWest,
      [southWest[0], northEast[1]],
      northEast,
      [northEast[0], southWest[1]],
      southWest,
    ];
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [latLngRingToGeoJson(ring)],
      },
      properties: { chefsType },
    };
  }

  if (chefsType === 'polygon') {
    const points = flattenLatLngs(drawn.coordinates);
    if (points.length < 3) {
      return null;
    }
    const ring = [...points];
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      ring.push(first);
    }
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [latLngRingToGeoJson(ring)],
      },
      properties: { chefsType },
    };
  }

  if (chefsType === 'polyline') {
    const points = flattenLatLngs(drawn.coordinates);
    if (points.length < 2) {
      return null;
    }
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: latLngRingToGeoJson(points),
      },
      properties: { chefsType },
    };
  }

  return null;
}

export function toFeatureCollection(
  value: ChefsMapValue,
): GeoJSON.FeatureCollection {
  const features =
    value.features
      ?.map((feature) => chefsFeatureToGeoJson(feature))
      .filter((feature): feature is GeoJSON.Feature => feature != null) ?? [];

  return { type: 'FeatureCollection', features };
}

/** Leaflet [lat, lng] center — default Victoria area when no drawable features. */
export function getMapCenter(
  collection: GeoJSON.FeatureCollection,
): LatLngTuple {
  if (collection.features.length === 0) {
    return DEFAULT_CENTER;
  }

  const first = collection.features[0];
  const geometry = first.geometry;
  if (!geometry) {
    return DEFAULT_CENTER;
  }

  if (geometry.type === 'Point') {
    const [lng, lat] = geometry.coordinates;
    if (typeof lng === 'number' && typeof lat === 'number') {
      return [lat, lng];
    }
  }

  if (geometry.type === 'Polygon' && Array.isArray(geometry.coordinates[0])) {
    const ring = geometry.coordinates[0] as number[][];
    if (ring.length > 0) {
      const [lng, lat] = ring[0];
      return [lat, lng];
    }
  }

  if (geometry.type === 'LineString' && Array.isArray(geometry.coordinates)) {
    const line = geometry.coordinates as number[][];
    if (line.length > 0) {
      const [lng, lat] = line[0];
      return [lat, lng];
    }
  }

  return DEFAULT_CENTER;
}

export function getDefaultZoom(featureCount: number): number {
  return featureCount > 0 ? 14 : 6;
}
