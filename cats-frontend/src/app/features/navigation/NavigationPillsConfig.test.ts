import { describe, it, expect } from 'vitest';
import { isSdsAppType } from './NavigationPillsConfig';

describe('isSdsAppType', () => {
  it('recognises the SDS abbreviation', () => {
    expect(isSdsAppType({ abbrev: 'SDS' })).toBe(true);
  });

  it('recognises the Site Disclosure Statement description', () => {
    expect(
      isSdsAppType({ abbrev: null, description: 'Site Disclosure Statement' }),
    ).toBe(true);
  });

  it('rejects other application types', () => {
    expect(
      isSdsAppType({ abbrev: 'CSR', description: 'Contaminated Site Request' }),
    ).toBe(false);
    expect(
      isSdsAppType({ abbrev: 'IR', description: 'Site Information Request' }),
    ).toBe(false);
    expect(isSdsAppType(null)).toBe(false);
  });
});
