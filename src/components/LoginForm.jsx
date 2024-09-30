import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../styles/LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('minimalist@hashcase.com');
  const [password, setPassword] = useState('123456789');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.owner_instance));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // You might want to add some error handling here, like showing an error message to the user
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;