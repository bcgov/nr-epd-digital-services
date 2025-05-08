import { formatCoordinate } from './formatCoordinate';

describe('formatCoordinate', () => {
  it('formats positive coordinates with degrees, minutes, and seconds', () => {
    expect(formatCoordinate(49.217436)).toBe('49d 13m 2.77s');
  });

  it('formats negative coordinates with degrees, minutes, and seconds', () => {
    expect(formatCoordinate(-122.621989)).toBe('-122d 37m 19.16s');
  });

  it('formats coordinates with only degrees and minutes', () => {
    expect(formatCoordinate(45.5)).toBe('45d 30m');
  });

  it('formats coordinates with zero minutes and seconds', () => {
    expect(formatCoordinate(90)).toBe('90d 0m');
  });

  it('formats coordinates with zero seconds', () => {
    expect(formatCoordinate(45.25)).toBe('45d 15m');
  });

  it('formats coordinates with very small values', () => {
    expect(formatCoordinate(0.000833)).toBe('0d 0m 3s');
  });

  it('formats coordinates with large values', () => {
    expect(formatCoordinate(179.999999)).toBe('179d 59m 60s');
  });

  it('handles zero coordinate', () => {
    expect(formatCoordinate(0)).toBe('0d 0m');
  });

  it('formats coordinates with exact minute values', () => {
    expect(formatCoordinate(45.5)).toBe('45d 30m');
  });

  it('formats coordinates with exact degree values', () => {
    expect(formatCoordinate(90)).toBe('90d 0m');
  });
});
