export const USERS = "/users";

export const COMS = "/api/v1/user";

export const GRAPHQL = "/graphql";

export const API: string =
  process.env.REACT_APP_BACKEND_API ||
  ((window as any)._env_ && (window as any)._env_.REACT_APP_BACKEND_API);

export const USERS_API: string =
  process.env.REACT_APP_BACKEND_USERS_API ||
  ((window as any)._env_ && (window as any)._env_.REACT_APP_BACKEND_USERS_API);

export const COMS_API: string =
  process.env.REACT_APP_BCBOX_BASE_URL ||
  ((window as any)._env_ && (window as any)._env_.REACT_APP_BCBOX_BASE_URL);

export const CAMUNDA_API =
  process.env.REACT_APP_CAMUNDA_API ||
  ((window as any)._env_ && (window as any)._env_.REACT_APP_CAMUNDA_API);
