import {
  chefsFeatureToGeoJson,
  getMapCenter,
  parseChefsMapValue,
  parseLatLng,
  toFeatureCollection,
} from './chefsMapTypes';

describe('parseChefsMapValue', () => {
  it('parses CHEFS map payload with marker features', () => {
    const value = {
      features: [{ type: 'marker', coordinates: { lat: 48.42, lng: -123.37 } }],
      selectedBaseLayer: 'OpenStreetMap',
    };

    expect(parseChefsMapValue(value)).toEqual(value);
  });

  it('returns null for non-map values', () => {
    expect(parseChefsMapValue(null)).toBeNull();
    expect(parseChefsMapValue({})).toBeNull();
  });
});

describe('parseLatLng', () => {
  it('parses object and string coordinates', () => {
    expect(parseLatLng({ lat: 48.42, lng: -123.37 })).toEqual([
      48.42, -123.37,
    ]);
    expect(parseLatLng('48.42,-123.37')).toEqual([48.42, -123.37]);
  });
});

describe('chefsFeatureToGeoJson', () => {
  it('converts CHEFS marker to GeoJSON Point', () => {
    const feature = chefsFeatureToGeoJson({
      type: 'marker',
      coordinates: { lat: 48.42, lng: -123.37 },
    });

    expect(feature).toEqual({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-123.37, 48.42] },
      properties: { chefsType: 'marker' },
    });
  });

  it('still accepts standard GeoJSON features', () => {
    const geo = {
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [-123.37, 48.42] },
      properties: {},
    };
    expect(chefsFeatureToGeoJson(geo)).toEqual(geo);
  });
});

describe('toFeatureCollection', () => {
  it('converts CHEFS markers and computes Leaflet center', () => {
    const collection = toFeatureCollection({
      features: [
        { type: 'marker', coordinates: { lat: 48.42, lng: -123.37 } },
        { invalid: true },
      ],
    });

    expect(collection.features).toHaveLength(1);
    expect(getMapCenter(collection)).toEqual([48.42, -123.37]);
  });
});
