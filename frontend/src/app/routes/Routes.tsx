import React from "react";
import Dashboard from "../features/dashboard/Dashboard";
import UsersList from "../features/users/UsersList";
import AddUserForm from "../features/users/AddUserForm";
import Landing from "../features/landing/Landing"
import { Routes , Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import { SignUp } from "../features/signup/signup";
import { UserProfile } from "../features/users/UserProfile";
import Map from '../features/Map/Map'

const AppRoutes = () => {
  return (
    <Routes>
        {/* <Route path="/dashboard" element={<ProtectedRoute auth={auth} element={<Dashboard/>}/>}/> */}
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard/>}/>}/>
        <Route path="/profile" element={<ProtectedRoute element={<UserProfile/>}/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/map" element={<Map/>}/>
        <Route path="/users" element={<UsersList />}></Route>
        <Route path="/users/add" element={<AddUserForm />}></Route>
        <Route path="*" element={<h1>Page not found</h1>}></Route>
    </Routes>
  );
};

export default AppRoutes;
