import { mapSdsToSiteDisclosure } from './sdsDisclosure.mapper';
import {
  sdsSubmissionFixture,
  sdsSubmissionFixtureMissingDates,
} from './__fixtures__/sdsSubmission.fixture';

describe('mapSdsToSiteDisclosure', () => {
  it('maps the Section IV CHEFS answers to the three SITE comment fields', () => {
    const result = mapSdsToSiteDisclosure(sdsSubmissionFixture);

    expect(result.plannedActivityComment).toBe(
      'Redevelop the site for a mixed-use residential and commercial building.',
    );
    expect(result.siteDisclosureComment).toBe(
      'BC Assessment records, historical aerial photographs and a Phase 1 ESA.',
    );
    expect(result.govDocumentsComment).toBe(
      'No past or present government orders apply to the site.',
    );
  });

  it('maps Schedule 2 references and drops the `none` option', () => {
    const result = mapSdsToSiteDisclosure(sdsSubmissionFixture);

    expect(result.schedule2References).toEqual([
      { code: 'A1', description: 'Adhesives manufacturing or bulk storage' },
      {
        code: 'C3',
        description: 'Metal plating or finishing',
      },
    ]);
  });

  it('produces no Schedule 2 rows when only `none` is selected', () => {
    const result = mapSdsToSiteDisclosure(sdsSubmissionFixtureMissingDates);

    expect(result.schedule2References).toEqual([]);
  });

  it('maps the CHEFS dates to the SITE dates when present', () => {
    const result = mapSdsToSiteDisclosure(sdsSubmissionFixture);

    expect(result.siteRegDateRecd).toBe('2024-04-15');
    expect(result.localAuthDateRecd).toBe('2024-04-15');
    expect(result.rwmDateDecision).toBe('2024-04-20');
    expect(result.dateCompleted).toBe('2024-05-01');
  });

  it('leaves missing dates blank and never defaults them to today', () => {
    const result = mapSdsToSiteDisclosure(sdsSubmissionFixtureMissingDates);

    expect(result.siteRegDateRecd).toBeNull();
    expect(result.localAuthDateRecd).toBeNull();
    expect(result.rwmDateDecision).toBeNull();
    expect(result.dateCompleted).toBeNull();
  });

  it('always leaves Date Entered empty', () => {
    const result = mapSdsToSiteDisclosure(sdsSubmissionFixture);

    expect(result.siteRegDateEntered).toBeNull();
  });

  it('does not project owners, PIDs/PINs, coordinates or the signature', () => {
    const result = mapSdsToSiteDisclosure(sdsSubmissionFixture) as Record<
      string,
      unknown
    >;

    expect(Object.keys(result)).toEqual([
      'siteRegDateRecd',
      'dateCompleted',
      'localAuthDateRecd',
      'rwmDateDecision',
      'siteRegDateEntered',
      'schedule2References',
      'plannedActivityComment',
      'siteDisclosureComment',
      'govDocumentsComment',
    ]);
    expect(JSON.stringify(result)).not.toContain('000-000-001');
    expect(JSON.stringify(result)).not.toContain('123 Test Street');
    expect(JSON.stringify(result)).not.toContain('base64');
  });

  it('unwraps the nested CHEFS container', () => {
    const nested = { container: { ...sdsSubmissionFixture.container } };
    const flat = sdsSubmissionFixture;

    expect(mapSdsToSiteDisclosure(nested).plannedActivityComment).toBe(
      mapSdsToSiteDisclosure(flat).plannedActivityComment,
    );
  });

  it('normalises unknown Schedule 2 values instead of dropping them', () => {
    const result = mapSdsToSiteDisclosure({
      container: {
        'Section3-IndustrialOrCommercialUses': {
          schedule2Reference: ['zz'],
        },
      },
    });

    expect(result.schedule2References).toEqual([
      { code: 'ZZ', description: null },
    ]);
  });

  it('de-duplicates repeated Schedule 2 references', () => {
    const result = mapSdsToSiteDisclosure({
      container: {
        'Section3-IndustrialOrCommercialUses': {
          schedule2Reference: ['a1', 'A1', 'a1'],
        },
      },
    });

    expect(result.schedule2References).toEqual([
      { code: 'A1', description: 'Adhesives manufacturing or bulk storage' },
    ]);
  });

  it('handles an empty submission without throwing', () => {
    const result = mapSdsToSiteDisclosure({});

    expect(result).toEqual({
      siteRegDateRecd: null,
      dateCompleted: null,
      localAuthDateRecd: null,
      rwmDateDecision: null,
      siteRegDateEntered: null,
      schedule2References: [],
      plannedActivityComment: null,
      siteDisclosureComment: null,
      govDocumentsComment: null,
    });
  });
});
