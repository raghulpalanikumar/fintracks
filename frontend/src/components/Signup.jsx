import React, { useState } from 'react';

const Signup = ({ onSignup, switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      onSignup(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-outer-wrapper">
      <header className="auth-header">
        <h1>Finance Tracker</h1>
        <p>Create your account to start tracking your finances.</p>
      </header>
      <div className="auth-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>Already have an account? <button className="switch-btn" onClick={switchToLogin}>Login</button></p>
      </div>
      <footer className="auth-footer">
        <p>&copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

import Footer from './Footer';

const SignupWithFooter = (props) => (
  <>
    <Signup {...props} />
    <Footer />
  </>
);

export default SignupWithFooter;
