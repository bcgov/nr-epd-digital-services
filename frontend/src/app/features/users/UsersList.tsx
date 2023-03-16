import { useSelector, useDispatch } from "react-redux";
import {
  selectAllUsers,
  getAllUsersError,
  getAllUsersFetchStatus,
  getUserDeleteStatus,
  getUserAddedStatus,
  deleteUser,
  fetchUsers,
  updateUser,
  resetDeleteStatus,
  resetAddedStatus,
} from "./UsersSlice";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AppDispatch } from "../../Store";
import { User } from "./dto/User";
import { RequestStatus } from "../../helpers/requests/status";
import { updateLastVisitURL } from "../applications/ApplicationSlice";


const UsersList = () => {

  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector(selectAllUsers);

  const fetchStatus = useSelector(getAllUsersFetchStatus);

  const deleteStatus = useSelector(getUserDeleteStatus);

  const addedStatus = useSelector(getUserAddedStatus);

  const fetchError = useSelector(getAllUsersError);

  const onDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  const onUpdateName = (name: string, id: number) =>{
    dispatch(updateUser({id:id, name:name}))
  }

  useEffect(() => {
    if (fetchStatus !== RequestStatus.loading && deleteStatus === RequestStatus.success) {
      dispatch(fetchUsers());
      dispatch(resetDeleteStatus({}));
    }

    if (fetchStatus !== RequestStatus.loading && addedStatus === RequestStatus.success) {
      dispatch(fetchUsers());
      dispatch(resetAddedStatus({ payload: {} }));
    }
  }, [fetchStatus, deleteStatus, addedStatus]);

  useEffect(()=>{
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
          <td>
            <button onClick={() => onDelete(user.id)}>Delete User</button>
          </td>
          <td>
            <button onClick={ () => onUpdateName(user.name+user.id,user.id) }>Update Name:</button>
          </td>
        </tr>
      );
    }
  });

  return (
    <section>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <h2>Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Delete</th>
            <th>Update Name with ID</th>
          </tr>
        </thead>
        <tbody>{renderedUsers}</tbody>
      </table>
    </section>
  );
};

export default UsersList;
