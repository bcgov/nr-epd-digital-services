import { UserManagerSettings } from 'oidc-client-ts';

// See `cats-frontend/src/app/constants/window.env.ts` for the types and description of these window envs, used in OpenShift

export function getClientSettings(): UserManagerSettings {
  return {
    authority:
      import.meta.env.VITE_AUTH_AUTHORITY || window?._env_?.VITE_AUTH_AUTHORITY,
    client_id:
      import.meta.env.VITE_AUTH_CLIENT_ID || window?._env_?.VITE_AUTH_CLIENT_ID,
    redirect_uri:
      import.meta.env.VITE_AUTH_REDIRECT_URI ||
      window?._env_?.VITE_AUTH_REDIRECT_URI,
    post_logout_redirect_uri:
      import.meta.env.VITE_AUTH_LOGOUT_REDIRECT_URI ||
      window?._env_?.VITE_AUTH_LOGOUT_REDIRECT_URI,
    response_type:
      import.meta.env.VITE_AUTH_RESPONSE_TYPE ||
      window?._env_?.VITE_AUTH_RESPONSE_TYPE,
    scope: import.meta.env.VITE_AUTH_SCOPE || window?._env_?.VITE_AUTH_SCOPE,
    filterProtocolClaims:
      import.meta.env.VITE_AUTH_FILTER_PROTOCOL_CLAIMS === 'true' ||
      window?._env_?.VITE_AUTH_FILTER_PROTOCOL_CLAIMS === 'true',
    loadUserInfo:
      import.meta.env.VITE_AUTH_AUTHORITY === 'true' ||
      window?._env_?.VITE_AUTH_AUTHORITY === 'true',
    revokeTokensOnSignout:
      import.meta.env.VITE_AUTH_AUTHORITY === 'true' ||
      window?._env_?.VITE_AUTH_AUTHORITY === 'true',
  };
}
