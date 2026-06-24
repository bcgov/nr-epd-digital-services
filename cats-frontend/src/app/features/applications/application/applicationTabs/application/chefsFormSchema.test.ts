import {
  normalizeChefsFormSchema,
  normalizeChefsSubmissionData,
} from './chefsFormSchema';

describe('normalizeChefsFormSchema', () => {
  it('maps CHEFS simple component types to standard Form.io types', () => {
    const schema = normalizeChefsFormSchema({
      title: 'NOM',
      components: [
        {
          type: 'simplepanel',
          key: 'S2',
          components: [
            { type: 'simpletextfield', key: 'S2-siteIdNumber', label: 'Site ID' },
            { type: 'simplecols2', key: 'cols', columns: [{ components: [{ type: 'simpleemail', key: 'email' }] }] },
          ],
        },
        { type: 'orgbook', key: 'org' },
        { type: 'map', key: 'map' },
      ],
    });

    const panel = schema.components[0] as Record<string, unknown>;
    expect(panel.type).toBe('panel');
    const fields = panel.components as Record<string, unknown>[];
    expect(fields[0].type).toBe('textfield');
    const cols = fields[1] as Record<string, unknown>;
    expect(cols.type).toBe('columns');
    const colField = (cols.columns as Record<string, unknown>[])[0]
      .components as Record<string, unknown>[];
    expect(colField[0].type).toBe('email');
    expect((schema.components[1] as Record<string, unknown>).type).toBe('textfield');
    expect((schema.components[2] as Record<string, unknown>).type).toBe('map');
  });
});

describe('normalizeChefsSubmissionData', () => {
  it('wraps CHEFS object datagrid rows as arrays', () => {
    const normalized = normalizeChefsSubmissionData({
      dataGrid: {
        'contact-email': 'a@gmail.com',
        'contact-ownername': 'owner',
      },
      'S2-siteIdNumber': '1000',
      _intake: { chefsSubmissionId: 'x' },
      submit: true,
    });

    expect(normalized.dataGrid).toEqual([
      {
        'contact-email': 'a@gmail.com',
        'contact-ownername': 'owner',
      },
    ]);
    expect(normalized['S2-siteIdNumber']).toBe('1000');
    expect(normalized._intake).toBeUndefined();
  });

  it('keeps map objects nested under container', () => {
    const normalized = normalizeChefsSubmissionData({
      container: {
        map: { features: [], selectedBaseLayer: 'OpenStreetMap' },
        dataGrid: [{ name: 'Jane' }],
      },
    });

    expect(normalized.container).toEqual({
      map: { features: [], selectedBaseLayer: 'OpenStreetMap' },
      dataGrid: [{ name: 'Jane' }],
    });
  });

  it('preserves map GeoJSON features without flattening', () => {
    const mapValue = {
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-123.37, 48.42] },
          properties: {},
        },
      ],
      selectedBaseLayer: 'OpenStreetMap',
    };

    const normalized = normalizeChefsSubmissionData({
      container: { map: mapValue },
    });

    expect(normalized.container).toEqual({ map: mapValue });
  });
});
