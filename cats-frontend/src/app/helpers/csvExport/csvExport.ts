function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null;
}

export function convertArrayToCSV(array: unknown[]) {
  if (array.length === 0 || !isObject(array[0])) {
    return '';
  }

  // Collect all unique keys from all objects
  const keys = Array.from(
    new Set(array.flatMap((item) => (isObject(item) ? Object.keys(item) : []))),
  );

  const header = keys.join(',');
  const rows = array
    .map((row) => {
      if (isObject(row)) {
        return keys.map((key) => row[key] ?? '').join(',');
      }
      return '';
    })
    .join('\n');

  return `${header}\n${rows}`;
}

export function downloadCSV(array: unknown[], filename: string = 'export.csv') {
  const csvString = convertArrayToCSV(array);
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
