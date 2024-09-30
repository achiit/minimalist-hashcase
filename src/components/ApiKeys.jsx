import React, { useState, useEffect } from 'react';
import { getApiKeys } from '../services/api';
import '../styles/ApiKeys.css';

function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const keys = await getApiKeys();
      setApiKeys(keys);
    } catch (err) {
      setError('Failed to fetch API keys');
      console.error(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="api-keys">
      <h2>API Keys</h2>
      {apiKeys.length === 0 ? (
        <p>No API keys found.</p>
      ) : (
        apiKeys.map((key, index) => (
          <div key={index} className="api-key">
            <span>API Key {index + 1}: {key}</span>
            <button onClick={() => copyToClipboard(key)}>Copy</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ApiKeys;