/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API: string;
  readonly VITE_AUTH_AUTHORITY: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_CLIENT_SECRET: string;
  readonly VITE_AUTH_REDIRECT_URI: string;
  readonly VITE_AUTH_LOGOUT_REDIRECT_URI: string;
  readonly VITE_AUTH_RESPONSE_TYPE: string;
  readonly VITE_AUTH_SCOPE: string;
  readonly VITE_AUTH_FILTER_PROTOCOL_CLAIMS: string;
  readonly VITE_AUTH_LOAD_USER_INFO: string;
  readonly VITE_AUTH_REVOKE_TOKENS_ON_SIGNOUT: string;
  readonly VITE_SITE_REGISTRAR_USER_ROLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
