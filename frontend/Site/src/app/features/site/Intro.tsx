import React from "react";
import "./Intro.css";

const Intro = () => {
  return (
    <div data-testid="intro" className="intro">
      <div className="intro-heading">
        <span className="gold-bar">&nbsp;</span>
        <span className="text">Introducing the New Site Registry</span>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-4 mt-2">
          <div data-testid="intro-section" className="intro-section">
            <span className="intro-section-heading">How To Search</span>
            <span className="intro-section-content">
              Ea similique eum id illo et commodi. Itaque ducimus accusantium
              qui consequatur. Vitae nulla impedit laborum suscipit dolor ex at
              numquam. Optio rerum et enim impedit. Labore deserunt cupiditate
              deleniti.
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-4 mt-2">
          <div data-testid="intro-section" className="intro-section">
            <span className="intro-section-heading">Help + Support</span>
            <span className="intro-section-content">
              Ea similique eum id illo et commodi. Itaque ducimus accusantium
              qui consequatur. Vitae nulla impedit laborum suscipit dolor ex at
              numquam. Optio rerum et enim impedit. Labore deserunt cupiditate
              deleniti.
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-4 mt-2">
          <div data-testid="intro-section" className="intro-section">
            <span className="intro-section-heading">Contact Us</span>
            <span className="intro-section-content">
              Ea similique eum id illo et commodi. Itaque ducimus accusantium
              qui consequatur. Vitae nulla impedit laborum suscipit dolor ex at
              numquam. Optio rerum et enim impedit. Labore deserunt cupiditate
              deleniti.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
