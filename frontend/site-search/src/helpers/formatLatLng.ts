export function formatLatLng(latlng: number): string {
    const absolute = Math.abs(latlng);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees - (minutes / 60)) * 3600).toFixed(2);
  
    return `${degrees}d ${minutes}m ${seconds}s`;
  }