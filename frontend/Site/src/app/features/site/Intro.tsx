import React from "react";
import "./Intro.css";
import { INFO_TEXT_1 } from "../../constants/Constant";

const Intro = () => {
  return (
    <div data-testid="intro" className="intro">
      <div className="intro-heading">
        <span className="gold-bar">&nbsp;</span>
        <span className="text">Introducing the New Site Registry</span>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-4 mt-3">
          <div data-testid="intro-section" className="intro-section">
            <span className="intro-section-heading">How To Search</span>
            <span className="intro-section-content">
            {INFO_TEXT_1}
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-4 mt-3">
          <div data-testid="intro-section" className="intro-section">
            <span className="intro-section-heading">Help + Support</span>
            <span className="intro-section-content">
            {INFO_TEXT_1}
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-4 mt-3">
          <div data-testid="intro-section" className="intro-section">
            <span className="intro-section-heading">Contact Us</span>
            <span className="intro-section-content">
            {INFO_TEXT_1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
