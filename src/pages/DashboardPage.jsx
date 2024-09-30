import React from 'react';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';
import '../styles/DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default DashboardPage;