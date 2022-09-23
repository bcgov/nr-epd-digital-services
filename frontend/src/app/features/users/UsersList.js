import { useSelector, useDispatch } from "react-redux";
import {
  selectAllUsers,
  getAllUsersError,
  getAllUsersStatus,
  fetchUsers,
} from "./UsersSlice";
import { useEffect } from "react";

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
    return (
      <article key={user.id}>
        <h3>{user.name}</h3>
      </article>
    );
  });

  return (
    <section>
      <h2>Users</h2>
      {renderedUsers}
    </section>
  );
};

export default UsersList;
