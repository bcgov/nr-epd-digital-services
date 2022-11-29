import React from "react";
import Dashboard from "../features/dashboard/Dashboard";
import UsersList from "../features/users/UsersList";
import AddUserForm from "../features/users/AddUserForm";
import Landing from "../features/landing/Landing"
import { Routes , Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import { SignUpLanding } from "../features/SignUpLanding/SignUpLanding";
import { UserProfile } from "../features/profile/UserProfile";

const AppRoutes = () => {
  return (
    <Routes>
        {/* <Route path="/dashboard" element={<ProtectedRoute auth={auth} element={<Dashboard/>}/>}/> */}
        <Route path="/" element={<Landing/>}></Route>
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard/>}/>}/>
        <Route path="/userprofile" element={<ProtectedRoute element={<UserProfile/>}/>}/>
        <Route path="/signuplanding" element={<SignUpLanding/>}/>
        <Route path="/users" element={<UsersList />}></Route>
        <Route path="/users/add" element={<AddUserForm />}></Route>
        <Route path="*" element={<h1>Page not found</h1>}></Route>
    </Routes>
  );
};

export default AppRoutes;
