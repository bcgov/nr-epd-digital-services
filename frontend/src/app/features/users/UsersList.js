import { useSelector, useDispatch } from "react-redux";
import {
  selectAllUsers,
  getAllUsersError,
  getAllUsersStatus,
  deleteUser,
  fetchUsers,
} from "./UsersSlice";
import { useEffect, useState } from "react";
import { NavLink   } from "react-router-dom";  

import React from "react";

const UsersList = () => {
  
  const [userDeleted, setUserDeleted] = useState(false)

  const dispatch = useDispatch();

  const users = useSelector(selectAllUsers);

  const fetchStatus = useSelector(getAllUsersStatus);

  const fetchError = useSelector(getAllUsersError);

  const onDelete = (id) =>{
    
    dispatch(deleteUser(id))
    console.log("Deleting user : "+ id)
    setUserDeleted(true)

  }

  useEffect(() => {
    if(fetchStatus=='idle'||userDeleted)
    {
      console.log("Fetching Users")
      dispatch(fetchUsers());
      setUserDeleted(false)
    }
  }, [fetchStatus,dispatch,userDeleted]);

  const renderedUsers = users.map((user) => {
    if(user){
      return (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td><button onClick = {() => onDelete(user.id)}>Delete User</button></td>
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
          <th>
            Delete
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
