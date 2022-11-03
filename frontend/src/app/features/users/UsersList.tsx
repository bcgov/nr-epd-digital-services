import { useSelector, useDispatch } from "react-redux";
import {
  selectAllUsers,
  getAllUsersError,
  getAllUsersFetchStatus,
  getUserDeleteStatus,
  getUserAddedStatus,
  deleteUser,
  fetchUsers,
  resetDeleteStatus,
  resetAddedStatus,
} from "./UsersSlice";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import React from "react";
import { AppDispatch } from "../../Store";
import { User } from "./dto/User";
import { consoleLog } from "../../helpers/utility";
import { RequestStatus } from "../../helpers/requests/status";
import { updateLastVisitURL } from "../applications/ApplicationSlice";


const UsersList = () => {

  
  const [userDeleted, setUserDeleted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector(selectAllUsers);

  const fetchStatus = useSelector(getAllUsersFetchStatus);

  const delteStatus = useSelector(getUserDeleteStatus);

  const addedStatus = useSelector(getUserAddedStatus);

  const fetchError = useSelector(getAllUsersError);

  const onDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (fetchStatus !== RequestStatus.loading && delteStatus === RequestStatus.success) {
      dispatch(fetchUsers());
      dispatch(resetDeleteStatus({}));
    }

    if (fetchStatus !== RequestStatus.loading && addedStatus === RequestStatus.success) {
      dispatch(fetchUsers());
      dispatch(resetAddedStatus({ payload: {} }));
    }
  }, [fetchStatus, delteStatus, addedStatus]);

  useEffect(()=>{
    console.log('fetchError',fetchError)
    if(fetchError!== null && fetchError!==""){
      alert(fetchError)
    }

  },[fetchError])

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(updateLastVisitURL('users'))
  }, []);

  const renderedUsers = users.map((user: User) => {
    if (user) {
      return (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td>
            <button onClick={() => onDelete(user.id)}>Delete User</button>
          </td>
        </tr>
      );
    }
  });

  return (
    <section>
      <NavLink to="/">Dashboard</NavLink>
      <h2>Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Email</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{renderedUsers}</tbody>
      </table>
    </section>
  );
};

export default UsersList;
