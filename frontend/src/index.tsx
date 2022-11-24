import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/Store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from "react-oidc-context";
import { UserManagerSettings } from 'oidc-client-ts';
import { getClientSettings } from './app/auth/UserManagerSetting';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);

const authOptions: UserManagerSettings = getClientSettings();

console.log('ENV VARS (index.tsx)', 
{
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
  
});

root.render(
  <React.StrictMode>
    
     <AuthProvider {...authOptions}>
     <Provider store={store}>
    <App />
    </Provider> 
    </AuthProvider> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
