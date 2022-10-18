import React from 'react'
import { Link } from 'react-router-dom';

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