import React from "react";
import ReactDOM from "react-dom";
import { ReactComponent } from "react-formio";
import settingsForm from "./appFileUpload.settingsForm";


export default class AppFileUpload extends ReactComponent {
  /**
   * This function tells the form builder about your component. It's name, icon and what group it should be in.
   *
   * @returns {{title: string, icon: string, group: string, documentation: string, weight: number, schema: *}}
   */
  static get builderInfo() {
    return {
      title: "Application File Upload",
      icon: "map-marker",
      group: "basic",
      documentation: "", //TODO
      weight: 120,
      schema: AppFileUpload.schema(),
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
      type: "AppFileUpload",
      label: "File Upload",
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

    ReactDOM.render(   
      <a
        href="javascript:void(0)"
        onClick={() => {
          console.log('file upload');
          var customeApplicationId = this.data.applicationId;
      

          let mapURL = 
          process.env.REACT_APP_CUSTOM_FILE_UPLOAD || window._env_.REACT_APP_CUSTOM_FILE_UPLOAD;
       
          window.open(
            mapURL + "?appId=" + customeApplicationId ,
            "_blank",
            "popup=yes,width=500px,heigth=500px"
          );      

          console.log("adding listner end");

          return false;
        }}
      >
        View / Upload Documents
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
