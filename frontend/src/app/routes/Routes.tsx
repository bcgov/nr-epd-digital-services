import React from "react";
import Dashboard from "../features/dashboard/Dashboard";
import UsersList from "../features/users/UsersList";
import AddUserForm from "../features/users/AddUserForm";
import { Routes , Route } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={< Dashboard />}></Route>
        <Route path="/users" element={<UsersList />}></Route>
        <Route path="/users/add" element={<AddUserForm />}></Route>
        <Route path="*" element={<h1>Page not found</h1>}></Route>
    </Routes>
  );
};

export default AppRoutes;
