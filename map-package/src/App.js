import logo from "./logo.svg";
import "./App.css";
import CustomMap from "./map/Map";
import { useEffect, useState } from "react";

function App() {
  const [location, setLocation] = useState([48.44577, -123.35826 ]);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let lat = parseFloat(urlParams.get("lat"));
    let long = parseFloat(urlParams.get("long"));
    let readOnly = urlParams.get("readOnly") === "true" ? true : false;
    console.log("lat,long", lat, long);
    setLocation([lat, long]);
    if(readOnly)
    setReadOnly(readOnly);
  }, []);

  const handleCallback = (data) => {
    console.log("data received", data);
  };

  return (
    <div className="parentCustomStyles">
      <CustomMap callback={handleCallback} initLocation={location} readOnly={readOnly} ></CustomMap>
    </div>
  );
}

export default App;
