import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import '../styles/Leaderboard.css';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(period);
      setLeaderboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  if (isLoading) return <div>Loading leaderboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <div className="period-selector">
        <label htmlFor="period-select">Select Period: </label>
        <select id="period-select" value={period} onChange={handlePeriodChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      {leaderboardData.length === 0 ? (
        <p>No leaderboard data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User ID</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry) => (
              <tr key={entry.user_id}>
                <td>{entry.rank}</td>
                <td>{entry.user_id}</td>
                <td>{parseFloat(entry.total_points).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;