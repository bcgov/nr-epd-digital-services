import React from "react";
import ReactDOM from "react-dom";
import { ReactComponent } from "react-formio";
import settingsForm from "./maps.settingsForm";


export default class Maps extends ReactComponent {
  /**
   * This function tells the form builder about your component. It's name, icon and what group it should be in.
   *
   * @returns {{title: string, icon: string, group: string, documentation: string, weight: number, schema: *}}
   */
  static get builderInfo() {
    return {
      title: "Parcel Map",
      icon: "map-marker",
      group: "basic",
      documentation: "", //TODO
      weight: 110,
      schema: Maps.schema(),
    };
  }

  /**
   * This function is the default settings for the component. At a minimum you want to set the type to the registered
   * type of your component (i.e. when you call Components.setComponent('type', MyComponent) these types should match.
   *
   * @param sources
   * @returns {*}
   */
  static schema() {
    return ReactComponent.schema({
      type: "Maps",
      label: "Maps",
    });
  }

  /*
   * Defines the settingsForm when editing a component in the builder.
   */
  static editForm = settingsForm;

  static eventRegistered = false;

  /**
   * This function is called when the DIV has been rendered and added to the DOM. You can now instantiate the react component.
   *
   * @param DOMElement
   * #returns ReactInstance
   *
   *
   */
  attachReact(element) {
    let instance;

    let ConvertDDToDMS = (D, lng) => {
      return {
        dir: D < 0 ? (lng ? "W" : "S") : lng ? "E" : "N",
        deg: 0 | (D < 0 ? (D = -D) : D),
        min: 0 | (((D += 1e-9) % 1) * 60),
        sec: (0 | (((D * 60) % 1) * 6000)) / 100,
      };
    };

    let ConvertDMSToDD = (degrees, minutes, seconds, lng) => {
      var dd = degrees + ( minutes / 60 ) + ( seconds / (60 * 60) );

      if (lng) {
        dd = dd * -1;
      }
      return dd;
    };

    let updateComponentValue = (
      currentInstance,
      formId,
      componentName,
      newValue
    ) => {

      for(let i in currentInstance.Formio.forms)
      {
          if(currentInstance.Formio.forms[i].components.length > 0)
          {
            currentInstance.Formio.forms[i].everyComponent(
              (componentInstance) => {
                if (componentInstance.key === componentName) {
                  componentInstance.setValue(newValue);
                }         
              }
            );
          }
      }

      
    };

    ReactDOM.render(   
      <a
        href="javascript:void(0)"
        onClick={() => {
          console.log(this);

          let lngD = parseInt(this.data.section2LongitudeDegrees);
          let lngM = parseInt(this.data.section2LongitudeMinutes);
          let lngS = parseFloat(this.data.section2LongitudeSeconds);
          let formLong = ConvertDMSToDD(lngD, lngM, lngS, true);

          let lD = parseInt(this.data.section2LatitudeDegrees);
          let lM = parseInt(this.data.section2LatitudeMinutes);
          let lS = parseFloat(this.data.section2LatitudeSeconds);
          let formLat = ConvertDMSToDD(lD, lM, lS);

          let readOnly =
            this.data.applicationId != "" &&
            this.data.applicationStatus != "Resubmit";

          let mapURL = 
          process.env.REACT_APP_CUSTOM_MAP_URL || window._env_.REACT_APP_CUSTOM_MAP_URL;
       
          window.open(
            mapURL + "?lat=" +
              formLat +
              "&long=" +
              formLong +
              "&readOnly=" +
              readOnly,
            "_blank",
            "popup=yes,width=500px,heigth=500px"
          );      

          console.log(
            "adding listner ",
            this.eventRegistered,
            this.reactInstance
          );

          var myListener = function (e) {
            console.log("inside lister");
            console.log("e", e);
            console.log("this", this);
            console.log("this", this.Formio, Object.keys(this.Formio.forms));
            //a.close();

            let formId = Object.keys(this.Formio.forms)[0];

            var result = ConvertDDToDMS(e.data.lat, false);
            ConvertDDToDMS(e.data.long, true);

            updateComponentValue(
              this,
              formId,
              "section2LatitudeDegrees",
              result.deg
            );
            updateComponentValue(
              this,
              formId,
              "section2LatitudeMinutes",
              result.min
            );
            updateComponentValue(
              this,
              formId,
              "section2LatitudeSeconds",
              result.sec
            );
    
            result = ConvertDDToDMS(e.data.long, true);

            updateComponentValue(
              this,
              formId,
              "section2LongitudeDegrees",
              result.deg
            );
            updateComponentValue(
              this,
              formId,
              "section2LongitudeMinutes",
              result.min
            );
            updateComponentValue(
              this,
              formId,
              "section2LongitudeSeconds",
              result.sec
            );

          };

          window.addEventListener("message", myListener, { once: true });

          console.log("adding listner end");

          return false;
        }}
      >
        Show Map
      </a>,
      element,
      () => (this.reactInstance = instance)
    );
  }

  /**
   * Automatically detach any react components.
   *
   * @param element
   */
  detachReact(element) {
    if (element) {
      ReactDOM.unmountComponentAtNode(element);
    }
  }
}
