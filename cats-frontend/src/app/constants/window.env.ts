export {};

/**
 * In OpenShift, we make use of `config.js` to have runtime environment variables. We can't just do
 * `import meta.env` as we do in local development. OpenShift builds are also compiled then placed in nginx,
 * which is why we need to use `config.js` to set these variables at runtime.
 *
 * So, anywhere we do `import meta.env.VITE_*`, we need to also check for `window._env_.VITE_*` as a fallback.
 * This ensures that our application can run in both local and production environments seamlessly.
 *
 * Also see: `charts/app/templates/frontend/templates/configmap.yaml`
 *
 * example:
 *    const FORM_API: string = import.meta.env.VITE_FORM_API || window._env_.VITE_FORM_API;
 */
declare global {
  interface Window {
    _env_: {
      VITE_AUTH_AUTHORITY: string;
      VITE_AUTH_CLIENT_ID: string;
      VITE_AUTH_REDIRECT_URI: string;
      VITE_AUTH_LOGOUT_REDIRECT_URI: string;
      VITE_AUTH_RESPONSE_TYPE: string;
      VITE_AUTH_SCOPE: string;
      VITE_AUTH_FILTER_PROTOCOL_CLAIMS: string;
      VITE_FORM_API: string;
      VITE_FORM_BACKEND_API: string;
      VITE_FORM_FLOW_API: string;
      VITE_GEOCODER_API: string;
      VITE_BACKEND_API: string;
      VITE_BCBOX_APP_URL: string;
      VITE_BCBOX_BUCKET_URL: string;
      VITE_COMS_ACCESS_KEY_ID: string;
      VITE_COMS_BUCKET: string;
      VITE_COMS_ENDPOINT: string;
      VITE_COMS_ACCESS_REGION: string;
      VITE_COMS_ACCESS_KEY: string;
    };
  }
}
