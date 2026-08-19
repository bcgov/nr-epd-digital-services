import { getPageWindow } from './getPageWindow';

describe('getPageWindow', () => {
  it('returns an empty window for zero results', () => {
    expect(getPageWindow(1, 0)).toEqual([]);
  });

  it('returns a single page when there is only one', () => {
    expect(getPageWindow(1, 1)).toEqual([1]);
  });

  it('returns every page when the total fits in the window', () => {
    expect(getPageWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageWindow(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('shows a trailing ellipsis on the first page of a large set', () => {
    expect(getPageWindow(1, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
  });

  it('shows a leading ellipsis on the last page of a large set', () => {
    expect(getPageWindow(10, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
  });

  it('shows ellipsis on both sides when the current page is in the middle', () => {
    expect(getPageWindow(5, 10)).toEqual([
      1,
      'ellipsis',
      4,
      5,
      6,
      'ellipsis',
      10,
    ]);
  });
});
