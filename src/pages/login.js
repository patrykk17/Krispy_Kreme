import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Login successful');
        router.push('/');
      } else {
        setErrorMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f9',
      margin: 0,
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Login Form</h2>
        <div style={{ marginBottom: '15px', width: '100%' }}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '95%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px',
              marginBottom: '10px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px', width: '100%' }}>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '95%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px',
              marginBottom: '10px',
            }}
          />
        </div>
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
        {errorMessage && (
          <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
