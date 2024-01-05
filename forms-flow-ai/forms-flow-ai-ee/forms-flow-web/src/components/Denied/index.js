import React from "react";
import "./pagenotfound.scss";

const NotFound = React.memo(({ errorMessage, errorCode }) => {
  return (
    <section>
      <div className="circles">
        <p>
          {errorCode}
          <br />
          <small>{errorMessage}</small>
        </p>
        <span className="circle big" />
        <span className="circle med" />
        <span className="circle small" />
      </div>
    </section>
  );
});

NotFound.defaultProps = {
  errorMessage: "You are not allowed to access this page",
  errorCode: "403",
};

export default NotFound;
