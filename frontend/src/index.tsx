import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/Store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "react-oidc-context";
import { UserManagerSettings } from "oidc-client-ts";
import { getClientSettings } from "./app/auth/UserManagerSetting";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLDivElement,
);

const authOptions: UserManagerSettings = getClientSettings();
root.render(
  <React.StrictMode>
    <AuthProvider {...authOptions}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
