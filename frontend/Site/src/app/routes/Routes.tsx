import React from "react";
// import Landing from "../features/landing/Landing"
import { Routes, Route } from "react-router-dom";
import Search from "../features/site/Search";
import MapSearch from "../features/map/MapSearch";
import Details from "../features/site/Details";

const AppRoutes = () => {
  return (
    <Routes>     
      <Route path="/" element={<Search />}></Route>  
      <Route path="/site/details" element={<Details/>}></Route>
      <Route path="/map" element={<MapSearch/>}></Route>  
      <Route path="*" element={<h1>Page not found</h1>}></Route>
    </Routes>
  );
};

export default AppRoutes;
