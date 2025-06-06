import { UserManagerSettings } from "oidc-client-ts";

export function getClientSettings(): UserManagerSettings {
  return {
    authority:
      import.meta.env.VITE_AUTH_AUTHORITY ||
      ((window as any)._env_ && (window as any)._env_.VITE_AUTH_AUTHORITY) ||
      "",
    client_id:
      import.meta.env.VITE_AUTH_CLIENT_ID ||
      ((window as any)._env_ && (window as any)._env_.VITE_AUTH_CLIENT_ID) ||
      "",
    redirect_uri:
      import.meta.env.VITE_AUTH_REDIRECT_URI ||
      ((window as any)._env_ && (window as any)._env_.VITE_AUTH_REDIRECT_URI) ||
      "",
    post_logout_redirect_uri:
      import.meta.env.VITE_AUTH_LOGOUT_REDIRECT_URI ||
      ((window as any)._env_ &&
        (window as any)._env_.VITE_AUTH_LOGOUT_REDIRECT_URI) ||
      "",
    response_type:
      import.meta.env.VITE_AUTH_RESPONSE_TYPE ||
      ((window as any)._env_ &&
        (window as any)._env_.VITE_AUTH_RESPONSE_TYPE) ||
      "",
    scope:
      import.meta.env.VITE_AUTH_SCOPE ||
      ((window as any)._env_ && (window as any)._env_.VITE_AUTH_SCOPE) ||
      "",
    filterProtocolClaims:
      import.meta.env.VITE_AUTH_FILTER_PROTOCOL_CLAIMS === "true" ||
      ((window as any)._env_ &&
        (window as any)._env_.VITE_AUTH_FILTER_PROTOCOL_CLAIMS === "true"),
    loadUserInfo:
      import.meta.env.VITE_AUTH_LOAD_USER_INFO === "true" ||
      ((window as any)._env_ &&
        (window as any)._env_.VITE_AUTH_LOAD_USER_INFO === "true"),
    revokeTokensOnSignout:
      import.meta.env.VITE_AUTH_REVOKE_TOKENS_ON_SIGNOUT === "true" ||
      ((window as any)._env_ &&
        (window as any)._env_.VITE_AUTH_REVOKE_TOKENS_ON_SIGNOUT === "true"),
  };
}

//export const API:string = import.meta.env.VITE_BACKEND_API|| ((window as any)._env_ && (window as any)._env_.VITE_BACKEND_API)
