import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, getLoyaltyPoints, addLoyaltyCode, dailyCheckIn, getStreak, redirectToLogin } from '../services/api';
import '../styles/Users.css';

const LOYALTY_CODES = [
  'LOYALTY_CODE_001',
  'LOYALTY_CODE_002',
  'LOYALTY_CODE_003',
  'LOYALTY_CODE_004',
  'LOYALTY_CODE_005',
  'LOYALTY_CODE_006',
];

function Users() {
  const [usersData, setUsersData] = useState({ users: [], totalCount: 0, currentPage: 1, totalPages: 1 });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loyaltyValues, setLoyaltyValues] = useState({});

  const fetchUsers = useCallback(async () => {
    if (!isLoading && usersData.users.length > 0) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      const usersWithPointsAndStreak = await Promise.all(data.users.map(async (user) => {
        try {
          const points = await getLoyaltyPoints(user.id, user.identifier);
          const streakData = await getStreak(user.id, user.identifier);
          return { ...user, points, streak: streakData.streakCount };
        } catch (err) {
          console.error(`Failed to fetch data for user ${user.id}:`, err);
          return { ...user, points: 'N/A', streak: 'N/A' };
        }
      }));
      setUsersData({ ...data, users: usersWithPointsAndStreak });
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Unauthorized') || err.message.includes('No authentication token or API key found')) {
        redirectToLogin();
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, usersData.users.length]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLoyaltyCodeSubmit = async (userId, identifier, code) => {
    const value = loyaltyValues[`${userId}-${code}`] || 0;
    try {
      const result = await addLoyaltyCode(userId, identifier, code, parseInt(value));
      const updatedUsers = usersData.users.map(user => 
        user.id === userId ? { ...user, points: result.totalPoints } : user
      );
      setUsersData(prev => ({ ...prev, users: updatedUsers }));
      alert(`Loyalty points updated. Points ${result.pointsAdded > 0 ? 'added' : 'subtracted'}: ${Math.abs(result.pointsAdded)}, Total points: ${result.totalPoints}`);
    } catch (err) {
      alert(`Failed to update loyalty points: ${err.message}`);
    }
  };

  const handleDailyCheckIn = async (userId, identifier) => {
    try {
      const result = await dailyCheckIn(userId, identifier);
      const streakData = await getStreak(userId, identifier);
      const updatedUsers = usersData.users.map(user => 
        user.id === userId ? { ...user, streak: streakData.streakCount } : user
      );
      setUsersData(prev => ({ ...prev, users: updatedUsers }));
      alert(`Daily check-in successful. Current streak: ${result.streak}`);
    } catch (err) {
      alert(`Failed to perform daily check-in: ${err.message}`);
    }
  };

  const handleLoyaltyValueChange = (userId, code, value) => {
    setLoyaltyValues(prev => ({ ...prev, [`${userId}-${code}`]: value }));
  };

  if (isLoading) return <div>Loading users data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users">
      <h2>Users</h2>
      <p>Total Users: {usersData.totalCount}</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Owner ID</th>
              <th>Identifier</th>
              <th>Created At</th>
              <th>Points</th>
              <th>Streak</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.users.map((user) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{user.id}</td>
                  <td>{user.owner_id}</td>
                  <td>{user.identifier}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>{typeof user.points === 'number' ? user.points.toFixed(2) : user.points}</td>
                  <td>{user.streak}</td>
                  <td>
                    <button onClick={() => document.getElementById(`actions-${user.id}`).classList.toggle('hidden')}>
                      Toggle Actions
                    </button>
                  </td>
                </tr>
                <tr id={`actions-${user.id}`} className="hidden">
                  <td colSpan="7">
                    <div className="loyalty-actions">
                      <div className="loyalty-action">
                        <button onClick={() => handleDailyCheckIn(user.id, user.identifier)}>
                          Daily Check-in
                        </button>
                      </div>
                      {LOYALTY_CODES.map(code => (
                        <div key={code} className="loyalty-action">
                          <button onClick={() => handleLoyaltyCodeSubmit(user.id, user.identifier, code)}>
                            {code}
                          </button>
                          <input 
                            type="number" 
                            value={loyaltyValues[`${user.id}-${code}`] || ''} 
                            onChange={(e) => handleLoyaltyValueChange(user.id, code, e.target.value)}
                            placeholder="Value"
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p>Page {usersData.currentPage} of {usersData.totalPages}</p>
    </div>
  );
}

export default Users;