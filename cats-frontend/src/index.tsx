import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import './index.css';
import reportWebVitals from './reportWebVitals';
import { store } from './app/Store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from 'react-oidc-context';
import { UserManagerSettings } from 'oidc-client-ts';
import { getClientSettings } from './app/auth/UserManagerSetting';
import { RouterProvider } from 'react-router-dom';
import siteRouter from './app/routes/Routes';
import { apolloClientInstance } from './apollo';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLDivElement,
);

// This is a required callback for proper auth experience. From the `react-oidc-context` docs:
// "You must provide an implementation of onSigninCallback to oidcConfig to remove the payload from the URL upon successful login.
// Otherwise if you refresh the page and the payload is still there, signinSilent - which handles renewing your token - won't work.""
const onSigninCallback = () => {
  // Get the original URL that was stored before redirect
  const returnUrl = sessionStorage.getItem('returnUrl');

  // Clear the auth params from URL
  window.history.replaceState({}, document.title, window.location.pathname);

  // Redirect to the original URL if it exists
  if (returnUrl) {
    sessionStorage.removeItem('returnUrl');
    window.location.href = returnUrl;
  }
};

const authOptions: UserManagerSettings = getClientSettings();
root.render(
  <React.StrictMode>
    <AuthProvider {...authOptions} onSigninCallback={onSigninCallback}>
      <ApolloProvider client={apolloClientInstance}>
        <Provider store={store}>
          <RouterProvider router={siteRouter} />
        </Provider>
      </ApolloProvider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
