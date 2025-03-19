export const USERS = "/users";

export const COMS = "/api/v1/user";

export const GRAPHQL = "/graphql";

export const API: string =
  import.meta.env.VITE_BACKEND_API ||
  ((window as any)._env_ && (window as any)._env_.VITE_BACKEND_API);

export const USERS_API: string =
  import.meta.env.VITE_BACKEND_USERS_API ||
  ((window as any)._env_ && (window as any)._env_.VITE_BACKEND_USERS_API);

export const COMS_API: string =
  import.meta.env.VITE_BCBOX_BASE_URL ||
  ((window as any)._env_ && (window as any)._env_.VITE_BCBOX_BASE_URL);

export const CAMUNDA_API =
  import.meta.env.VITE_CAMUNDA_API ||
  ((window as any)._env_ && (window as any)._env_.VITE_CAMUNDA_API);
