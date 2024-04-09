import { UserManagerSettings } from "oidc-client-ts";

export function getClientSettings(): UserManagerSettings {
    return {
      authority: process.env.REACT_APP_AUTH_AUTHORITY || ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_AUTHORITY) || "",
      client_id: process.env.REACT_APP_AUTH_CLIENT_ID || ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_CLIENT_ID) || "",
      redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URI || ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_REDIRECT_URI) || "",
      post_logout_redirect_uri: process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI || ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_LOGOUT_REDIRECT_URI) || "",
      response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE || ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_RESPONSE_TYPE) || "",
      scope: process.env.REACT_APP_AUTH_SCOPE || ((window as any)._env_ && (window as any)._env_.REACT_APP_AUTH_SCOPE) || "",
      filterProtocolClaims: process.env.REACT_APP_AUTH_FILTER_PROTOCOL_CLAIMS==="true" || ((window as any)._env_ &&  (window as any)._env_.REACT_APP_AUTH_FILTER_PROTOCOL_CLAIMS==="true"),
      loadUserInfo: process.env.REACT_APP_AUTH_LOAD_USER_INFO==='true'||  ((window as any)._env_ &&  (window as any)._env_.REACT_APP_AUTH_LOAD_USER_INFO==="true"),
      revokeTokensOnSignout:process.env.REACT_APP_AUTH_REVOKE_TOKENS_ON_SIGNOUT==='true'||  ((window as any)._env_ &&  (window as any)._env_.REACT_APP_AUTH_REVOKE_TOKENS_ON_SIGNOUT==="true"),
    };
  }

  //export const API:string = process.env.REACT_APP_BACKEND_API|| ((window as any)._env_ && (window as any)._env_.REACT_APP_BACKEND_API) 