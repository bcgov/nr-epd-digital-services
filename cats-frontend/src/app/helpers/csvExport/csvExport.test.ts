import { convertArrayToCSV } from './csvExport';

describe('convertArrayToCSV', () => {
  it('should return an empty string for an empty array', () => {
    expect(convertArrayToCSV([])).toBe('');
  });

  it('should return an empty string for an array with non-object elements', () => {
    expect(convertArrayToCSV([1, 2, 3])).toBe('');
  });

  it('should convert an array of objects to CSV format', () => {
    const array = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];
    const expectedCSV = 'name,age\nJohn,30\nJane,25';
    expect(convertArrayToCSV(array)).toBe(expectedCSV);
  });

  it('should handle objects with different keys', () => {
    const array = [
      { name: 'John', age: 30 },
      { name: 'Jane', city: 'Campbell River', age: 25 },
    ];
    const expectedCSV = 'name,age,city\nJohn,30,\nJane,25,Campbell River';
    expect(convertArrayToCSV(array)).toBe(expectedCSV);
  });

  it('should handle empty objects', () => {
    const array = [{ name: 'John', age: 30 }, {}];
    const expectedCSV = 'name,age\nJohn,30\n,';
    expect(convertArrayToCSV(array)).toBe(expectedCSV);
  });
});
