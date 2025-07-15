import React from "react";
import Dashboard from "../features/dashboard/Dashboard";
import Landing from "../features/landing/Landing";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { SignUp } from "../features/signup/signup";
import Map from "../features/Map/Map";
import { FileUpload } from "../features/bcbox/FileUpload";
import TaskAssignment from "../features/assignment/TaskAssignment";

const AppRoutes = () => {
  // just a comment to test
  return (
    <Routes>
      {/* <Route path="/dashboard" element={<ProtectedRoute auth={auth} element={<Dashboard/>}/>}/> */}
      <Route path="/" element={<Landing />}></Route>
      <Route path="/:redirect/:idp" element={<Landing />}></Route>

      <Route
        path="/:taskId"
        element={<ProtectedRoute element={<TaskAssignment />} />}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/map" element={<Map />} />
      <Route
        path="/fileupload"
        element={<ProtectedRoute element={<FileUpload />} />}
      />
      <Route path="*" element={<h1>Page not found</h1>}></Route>
    </Routes>
  );
};

export default AppRoutes;
