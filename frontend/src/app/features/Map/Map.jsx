import React, { useState, useEffect } from "react";
import Map from "../../../../node_modules/react-parcelmap-bc/dist/Map";

export default React.memo(() => {
  const [data, setData] = useState();
  const [location, setLocation] = useState([48.41974533439947, -123.36781242160622]);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let lat = parseFloat(urlParams.get("lat"));
    let long = parseFloat(urlParams.get("long"));
    let readOnly = urlParams.get("readOnly") === "true" ? true : false;
    console.log("lat,long", lat, long);
    if (!(isNaN(lat) && isNaN(long))) {
      setLocation([lat, long]);
    }
    if (readOnly) setReadOnly(readOnly);
  }, []);

  const handleClose = () => {
    console.log("posting message to parent with data");
    window.opener.postMessage(data, "*");
    window.close();
    console.log("posting message -e ");
  };

  useEffect(() => {
    if (data != null && data != undefined) {
      console.log("data chagned", data);
      handleClose();
    }
  }, [data]);

  const handleCallback = (data) => {
    console.log("data received <3", data);
    setData(data);
    //setTimeout(handleClose(),1000);
  };

  return (
    <div className="container" id="main" style={{ "margin-top": "65px" }}>
      <Map
        callback={handleCallback}
        initLocation={location}
        readOnly={readOnly}
      ></Map>
    </div>
  );
});
