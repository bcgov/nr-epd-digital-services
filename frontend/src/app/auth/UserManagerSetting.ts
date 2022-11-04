import { UserManagerSettings } from "oidc-client-ts";

export function getClientSettings(): UserManagerSettings {
    return {
      authority: process.env.REACT_APP_AUTH_AUTHORITY?process.env.REACT_APP_AUTH_AUTHORITY:"" ,
      client_id: process.env.REACT_APP_AUTH_CLIENT_ID?process.env.REACT_APP_AUTH_CLIENT_ID:"",
      client_secret: process.env.REACT_APP_AUTH_CLIENT_SECRET?process.env.REACT_APP_AUTH_CLIENT_SECRET:"",
      redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URI?process.env.REACT_APP_AUTH_REDIRECT_URI:"",
      post_logout_redirect_uri: process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI?process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI:"",
      response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE?process.env.REACT_APP_AUTH_RESPONSE_TYPE:"",
      scope: process.env.REACT_APP_AUTH_SCOPE?process.env.REACT_APP_AUTH_SCOPE:"",
      filterProtocolClaims: process.env.REACT_APP_AUTH_FILTER_PROTOCOL_CLAIMS==='true'? true:false,
      loadUserInfo: process.env.REACT_APP_AUTH_LOAD_USER_INFO==='true'? true:false,
      revokeTokensOnSignout:process.env.REACT_APP_AUTH_REVOKE_TOKENS_ON_SIGNOUT==='true'? true:false,
      
    };
  }