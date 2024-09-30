import React, { useState } from 'react';
import ApiKeys from './ApiKeys';
import Leaderboard from './Leaderboard';
import Users from './Users';
import { verifyApiKey, setApiKey, getApiKey } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeSection, setActiveSection] = useState('overview');
  const [isVerifyingApiKey, setIsVerifyingApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(null);

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <>
            <div className="card">
              <h2>Company</h2>
              <p>{user.company_name}</p>
            </div>
            <div className="card">
              <h2>Account Created</h2>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="card full-width">
              <ApiKeys />
            </div>
            <div className="card full-width">
              <Leaderboard />
            </div>
          </>
        );
      case 'users':
        return (
          <div className="card full-width users-section">
            <Users />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSectionChange = (section) => async (e) => {
    e.preventDefault();
    if (section === 'users') {
      const existingApiKey = getApiKey();
      if (existingApiKey) {
        setActiveSection(section);
      } else {
        setIsVerifyingApiKey(true);
      }
    } else {
      setActiveSection(section);
    }
  };

  const handleApiKeySubmit = async (e) => {
    e.preventDefault();
    const apiKey = e.target.apiKey.value;
    setApiKeyError(null);
    try {
      await verifyApiKey(apiKey);
      setApiKey(apiKey);
      setIsVerifyingApiKey(false);
      setActiveSection('users');
    } catch (error) {
      setApiKeyError(error.message);
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>
      <div className="dashboard-nav">
        <button 
          className={activeSection === 'overview' ? 'active' : ''} 
          onClick={handleSectionChange('overview')}
        >
          Overview
        </button>
        <button 
          className={activeSection === 'users' ? 'active' : ''} 
          onClick={handleSectionChange('users')}
        >
          Users
        </button>
      </div>
      {isVerifyingApiKey ? (
        <div className="api-key-verification">
          <h2>Enter your Dev API Key</h2>
          <form onSubmit={handleApiKeySubmit}>
            <input type="text" name="apiKey" required />
            <button type="submit">Verify</button>
          </form>
          {apiKeyError && <p className="error">{apiKeyError}</p>}
        </div>
      ) : (
        <div className="dashboard-content">
          {renderSection()}
        </div>
      )}
    </div>
  );
}

export default Dashboard;