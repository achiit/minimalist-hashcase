const API_URL = 'https://api.hashcase.co';
const OWNER_ID = '28';

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function getApiKey() {
  return localStorage.getItem('apiKey');
}

export function setApiKey(apiKey) {
  localStorage.setItem('apiKey', apiKey);
}

export function redirectToLogin() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('apiKey');
  window.location.href = '/';
}
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/owner/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function getApiKeys() {
  const token = localStorage.getItem('token');
  if (!token) {
    redirectToLogin();
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/owner/apikeys`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch API keys');
  }

  const data = await response.json();
  return data.api_keys;
}

export async function getLeaderboard(period) {
  const token = localStorage.getItem('token');
  if (!token) {
    redirectToLogin();
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/owner/leaderboard?ownerId=${OWNER_ID}&period=${period}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  const data = await response.json();
  return data.leaderboard;
}

export async function verifyApiKey(apiKey) {
  const token = getAuthToken();
  if (!token) {
    redirectToLogin();
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/owner/apikeys`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Invalid API key');
  }

  return true;
}

export async function getUsers() {
  const token = getAuthToken();
  const apiKey = getApiKey();
  if (!token || !apiKey) {
    redirectToLogin();
    throw new Error('No authentication token or API key found');
  }

  const response = await fetch(`${API_URL}/owner/users?ownerId=${OWNER_ID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch users data');
  }

  return response.json();
}

export async function getLoyaltyPoints(userId, identifier) {
  const token = getAuthToken();
  const apiKey = getApiKey();
  if (!token || !apiKey) {
    redirectToLogin();
    throw new Error('No authentication token or API key found');
  }

  const response = await fetch(`${API_URL}/dev/user/getLoyaltyPoints?user_id=${userId}&owner_id=${OWNER_ID}&identifier=${identifier}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch loyalty points');
  }

  const data = await response.json();
  return data.points ? parseFloat(data.points) : 0;
}
export async function addLoyaltyCode(userId, identifier, code, value) {
  const token = getAuthToken();
  const apiKey = getApiKey();
  if (!token || !apiKey) {
    redirectToLogin();
    throw new Error('No authentication token or API key found');
  }

  const response = await fetch(`${API_URL}/dev/user/addLoyaltyCode?user_id=${userId}&owner_id=${OWNER_ID}&identifier=${identifier}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, value }),
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Failed to add loyalty code');
  }

  return response.json();
}
export async function dailyCheckIn(userId, identifier) {
  const token = getAuthToken();
  const apiKey = getApiKey();
  if (!token || !apiKey) {
    redirectToLogin();
    throw new Error('No authentication token or API key found');
  }

  const response = await fetch(`${API_URL}/dev/user/daily-check-in?user_id=${userId}&owner_id=${OWNER_ID}&identifier=${identifier}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Failed to perform daily check-in');
  }

  return response.json();
}

export async function getStreak(userId, identifier) {
  const token = getAuthToken();
  const apiKey = getApiKey();
  if (!token || !apiKey) {
    redirectToLogin();
    throw new Error('No authentication token or API key found');
  }

  const response = await fetch(`${API_URL}/dev/user/get-streak?user_id=${userId}&owner_id=${OWNER_ID}&identifier=${identifier}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey,
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized: Token may have expired');
  }

  if (!response.ok) {
    throw new Error('Failed to get streak count');
  }

  return response.json();
}