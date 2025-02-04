export const GRAPHQL = '/graphql';

export const API: string =
  process.env.REACT_APP_BACKEND_API ||
  ((window as any)._env_ && (window as any)._env_.REACT_APP_BACKEND_API);

export const GEOCODER_API: string =
  process.env.REACT_APP_GEOCODER_API ||
  ((window as any)._env_ && (window as any)._env_.REACT_APP_GEOCODER_API);
