import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

const UserDashboard = ({ userId, token, onBack }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/admin/${userId}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Failed to fetch user data`);
      }
      
      if (data.success) {
        setUser(data.user);
        setTransactions(data.transactions);
        console.log(`Loaded ${data.count} transactions for user ${data.user.email}`);
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        <div>Loading user dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ color: '#ef4444', fontSize: '1.2rem' }}>Error: {error}</div>
        <button 
          onClick={fetchUserData}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        <div>User not found</div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #e2e8f0'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1e293b',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            👤 User Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Viewing dashboard for: <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
        
        <button
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Admin Panel
        </button>
      </div>

      {/* User Info Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Name</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user.name}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Email</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user.email}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Occupation</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user.occupation || 'Not set'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Location</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user.location || 'Not set'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Transactions</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{transactions.length}</div>
        </div>
      </div>

      {/* Dashboard Component */}
      <div style={{ 
        background: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#1e293b',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          📊 Financial Dashboard
        </h2>
        
        {transactions.length > 0 ? (
          <Dashboard transactions={transactions} />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#64748b',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <div>No transactions found for this user</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              This user hasn't added any financial transactions yet.
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f8fafc', 
        borderRadius: '8px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.9rem'
      }}>
        <strong>👑 Admin View:</strong> This is the financial dashboard for user <strong>{user.name}</strong>. 
        You can see all their transactions and financial data here.
      </div>
    </div>
  );
};

export default UserDashboard;
