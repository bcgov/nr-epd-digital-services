import React from 'react'
import { Link } from 'react-router-dom';
import UsersList from '../users/UsersList';
import AddUserForm from '../users/AddUserForm';

const Dashboard = () => {
  return (
    <div>
        <ul>
            <li>
                <Link to="/users"> List of Users </Link>
            </li>
            <li>
                <Link to="/users/add"> Add New User </Link>
            </li>
        </ul>
    </div>
  )
}

export default Dashboard