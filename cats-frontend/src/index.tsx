import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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
import { getUser } from './app/helpers/utility';
//import { API, GRAPHQL } from './app/helpers/endpoints';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLDivElement,
);

/*const httpLink = createHttpLink({
  uri: `${API}${GRAPHQL}`,
});*/

const authLink = setContext((_, { headers }) => {
  const user = getUser();

  return {
    headers: {
      ...headers,
      authorization: user?.access_token ? `Bearer ${user.access_token}` : '',
    },
  };
});

/*const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});*/

// This is a required callback for proper auth experience. From the `react-oidc-context` docs:
// "You must provide an implementation of onSigninCallback to oidcConfig to remove the payload from the URL upon successful login.
// Otherwise if you refresh the page and the payload is still there, signinSilent - which handles renewing your token - won't work.""
const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

const authOptions: UserManagerSettings = getClientSettings();
root.render(
  <React.StrictMode>
    <AuthProvider {...authOptions} onSigninCallback={onSigninCallback}>
      <Provider store={store}>
        <RouterProvider router={siteRouter} />
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
