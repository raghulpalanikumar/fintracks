import React, { useState } from 'react';

const Login = ({ onLogin, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleAdminLogin = () => {
    setEmail('admin@fintrack.com');
    setPassword('admin123');
    setIsAdminLogin(true);
  };

  const handleResetAdmin = () => {
    setEmail('');
    setPassword('');
    setIsAdminLogin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = {};
      }
      console.log('Login response:', data, 'Status:', res.status);
      if (!res.ok) {
        setError(data.message || data.error || `Login failed (status ${res.status})`);
        return;
      }
      if (data && data.user) {
        onLogin(data);
      } else {
        setError('Login succeeded but no user data returned.');
      }
    } catch (err) {
      setError(err.message || 'Network error during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #a855f7 100%)',
      fontFamily: 'Inter, Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
          borderRadius: '16px',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '0 8px 32px rgba(96,165,250,0.3)'
        }}>
          💎
        </div>
        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          FinTrack
        </h1>
        <p style={{
          margin: 0,
          color: 'rgba(255,255,255,0.85)',
          fontSize: 18,
          fontWeight: 500
        }}>
          Welcome back! Please login to continue.
        </p>
      </div>

      {/* Login Form */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 700,
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          Sign In
        </h2>
        
        {/* Admin Login Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={handleAdminLogin}
            style={{
              background: isAdminLogin 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (!isAdminLogin) {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.border = '1px solid rgba(255,255,255,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAdminLogin) {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.border = '1px solid rgba(255,255,255,0.2)';
              }
            }}
          >
            👑 {isAdminLogin ? 'Admin Mode' : 'Admin Login'}
          </button>
          
          {isAdminLogin && (
            <button
              type="button"
              onClick={handleResetAdmin}
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239,68,68,0.2)';
                e.target.style.border = '1px solid rgba(239,68,68,0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239,68,68,0.1)';
                e.target.style.border = '1px solid rgba(239,68,68,0.3)';
              }}
            >
              ✕ Reset
            </button>
          )}
        </div>
        
        {isAdminLogin && (
          <div style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 600 }}>
              👑 Admin Login Mode Active
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>
              Admin credentials have been filled automatically
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isAdminLogin}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: isAdminLogin 
                  ? '1px solid rgba(245,158,11,0.5)' 
                  : '1px solid rgba(255,255,255,0.2)',
                background: isAdminLogin 
                  ? 'rgba(245,158,11,0.1)' 
                  : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                opacity: isAdminLogin ? 0.8 : 1
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(96,165,250,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isAdminLogin}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: isAdminLogin 
                  ? '1px solid rgba(245,158,11,0.5)' 
                  : '1px solid rgba(255,255,255,0.2)',
                background: isAdminLogin 
                  ? 'rgba(245,158,11,0.1)' 
                  : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                opacity: isAdminLogin ? 0.8 : 1
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(96,165,250,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255,255,255,0.2)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#fca5a5',
              background: 'rgba(239,68,68,0.1)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid rgba(239,68,68,0.2)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: isAdminLogin 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              boxShadow: isAdminLogin 
                ? '0 4px 16px rgba(245,158,11,0.15)'
                : '0 4px 16px rgba(102,126,234,0.15)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = isAdminLogin 
                  ? '0 6px 20px rgba(245,158,11,0.25)'
                  : '0 6px 20px rgba(102,126,234,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isAdminLogin 
                  ? '0 4px 16px rgba(245,158,11,0.15)'
                  : '0 4px 16px rgba(102,126,234,0.15)';
              }
            }}
          >
            {loading ? (isAdminLogin ? 'Admin Signing in...' : 'Signing in...') : (isAdminLogin ? '👑 Admin Sign In' : 'Sign In')}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.7)',
            fontSize: '14px'
          }}>
            Don't have an account?{' '}
            <button
              onClick={switchToSignup}
              style={{
                background: 'none',
                border: 'none',
                color: '#60a5fa',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <p style={{
          margin: 0,
          color: 'rgba(255,255,255,0.5)',
          fontSize: '14px'
        }}>
          &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
