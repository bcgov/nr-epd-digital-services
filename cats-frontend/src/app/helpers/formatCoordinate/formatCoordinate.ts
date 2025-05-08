/**
 * Formats a coordinate (latitude or longitude) into degrees, minutes, and seconds format
 * @param coord The coordinate value (latitude or longitude)
 * @returns Formatted string in the format "Xd Ym Zs" where X is degrees, Y is minutes, Z is seconds
 */
export const formatCoordinate = (coord?: number | null): string => {
  if (!coord && coord !== 0) {
    return '';
  }

  const absCoord = Math.abs(coord);
  const degrees = Math.floor(absCoord);
  const decimalMinutes = (absCoord - degrees) * 60;
  const minutes = Math.floor(decimalMinutes);
  const seconds = Math.round((decimalMinutes - minutes) * 60 * 100) / 100;

  let result = `${degrees}d ${minutes}m`;
  if (seconds !== 0) {
    result += ` ${seconds}s`;
  }

  return coord < 0 ? `-${result}` : result;
};
