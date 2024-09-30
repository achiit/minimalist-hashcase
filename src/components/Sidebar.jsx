import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="sidebar">
      <div className="user-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;