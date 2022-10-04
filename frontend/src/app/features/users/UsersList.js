import { useSelector, useDispatch } from "react-redux";
import {
  selectAllUsers,
  getAllUsersError,
  getAllUsersStatus,
  fetchUsers,
} from "./UsersSlice";
import { useEffect } from "react";
import { NavLink   } from "react-router-dom";  

import React from "react";

const UsersList = () => {
    
  const dispatch = useDispatch();

  const users = useSelector(selectAllUsers);

  const fetchStatus = useSelector(getAllUsersStatus);

  const fetchError = useSelector(getAllUsersError);

  useEffect(() => {
    if(fetchStatus=='idle')
    {
    dispatch(fetchUsers());
    }
  }, [fetchStatus,dispatch]);

  const renderedUsers = users.map((user) => {
    if(user){
      return (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.id}</td>
          <td>{user.email}</td>
        </tr>
      );
    }else{

      
    }
    
  });

  return (
    <section>
        <NavLink  to="/">Dashboard</NavLink >
      <h2>Users</h2>
      <table className="table">
      <thead>
        <tr>
          <th>
            Name
          </th>
          <th>
            ID
          </th>
          <th>
            Email
          </th>
          </tr>
          </thead>
          <tbody>
      {renderedUsers}
      </tbody>
      </table>
    
    </section>
  );
};

export default UsersList;
