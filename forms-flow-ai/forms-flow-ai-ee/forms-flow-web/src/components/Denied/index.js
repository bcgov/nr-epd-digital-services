import React from "react";
import "./pagenotfound.scss";
import { SUPPORT_EMAIL } from "../../constants/constants";

const NotFound = React.memo(({ errorMessage, errorCode }) => {
  return (
    <section>
      <div className="circles">
        <p>
          {errorCode}
          <br />
          <small className="small-fontsize">{errorMessage}</small>
        </p>
        <span className="circle big" />
        <span className="circle med" />
        <span className="circle small" />
      </div>
    </section>
  );
});

NotFound.defaultProps = {
  errorMessage:
    "You do not have sufficient permissions to access this page. Please contact " +
    SUPPORT_EMAIL +
    " for further clarification.",
  errorCode: "403",
};

export default NotFound;
