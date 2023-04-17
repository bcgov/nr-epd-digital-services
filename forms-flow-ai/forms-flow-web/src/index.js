/* istanbul ignore file */
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import StoreService from "./services/StoreService";
import { Formio } from "react-formio";
import { AppConfig } from "./config";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./styles.scss";
import "./styles-bc.scss";
import "./resourceBundles/i18n.js";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { featureFlags } from "./featureToogle";
import { FlagsProvider } from "flagged";
import '@bcgov/bc-sans/css/BCSans.css';

import components from "./custom-components";

import { Components } from "react-formio";
//import BCGovFormioComponents2 from "./formcomponents/dist/bcgov-formio-components.js";


// disable react-dev-tools for this project
if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
  for (let [key, value] of Object.entries(
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__
  )) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] =
      typeof value == "function" ? () => {} : null;
  }
}

//  import("react-formio")
//  .then((x) => {

  // import("formcomponents").then((y)=>{
  //    console.log("y components",y);
  //   y.Formio.use(y.default);
  //   y.Formio.Components(y.default.components);
  //  // y.Formio.registerPlugin(y.default);
  //   // y.Components.addComponent("simplecontent",y.default.comopents.simplecontent);
  //   // y.Components.addComponent("simpletextfield",y.default.comopents.simpletextfield);
  // });


// });

// import("react-formio")
//   .then(() => {

//     import("@formio/contrib").then((y)=>{
//       Formio.use(y.default);
//       import("formcomponents")
//       .then((x) => {
//         console.log(
//           "Loading Components from FormComponents",x,
//           x.default.components
//         );

//         Formio.use(x.default);
//         Components.setComponents(x.default.components);

//       })
//       .catch((x) => {
//         console.log("Error loading child package", x);
//       });
//     })
//     .catch((x) => {
//       console.log("Error loading child package 2", x);
//     });

   
//   })
//   .catch((x) => {
//     console.log("Error loading base package", x);
//   });

const store = StoreService.configureStore();
const history = StoreService.history;

Formio.setProjectUrl(AppConfig.projectUrl);
Formio.setBaseUrl(AppConfig.apiUrl);

//Formio.use(B);
//Components.setComponent(B.components);
Components.setComponents(components);

//Set custom formio elements - Code splitted
// import("formsflow-formio-custom-elements/dist/customformio-ex").then(
//   (FormioCustomEx) => {
//     //Components.setComponents(FormioCustomEx.components);
//   }
// );

ReactDOM.render(
  <FlagsProvider features={featureFlags}>
    <App {...{ store, history }} />
  </FlagsProvider>,
  document.getElementById("app")
);

// Register service worker and if new changes skip waiting and activate new service worker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
});
