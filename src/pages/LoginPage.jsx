import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';

function LoginPage() {
  return (
    <div className="login-page">
      <h1>Welcome to Minimalist</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;