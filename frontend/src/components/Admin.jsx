import React, { useState, useEffect } from 'react';
import UserDashboard from './UserDashboard';

const Admin = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dbStatus, setDbStatus] = useState({ connected: false, userCount: 0 });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    checkDatabaseHealth();
    fetchUsers();
  }, []);

  const checkDatabaseHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/admin/health', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.database) {
        setDbStatus({
          connected: data.database.connected,
          userCount: data.database.userCount,
          status: data.database.status
        });
        console.log('Database health check:', data.database);
      }
    } catch (err) {
      console.error('Database health check failed:', err);
      setDbStatus({ connected: false, userCount: 0, status: 'Error' });
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingUserId(userId);
      
      const response = await fetch(`http://localhost:5000/api/users/admin/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Failed to delete user`);
      }
      
      if (data.success) {
        // Remove user from local state
        setUsers(users.filter(user => user._id !== userId));
        alert(`User "${userName}" deleted successfully!`);
        console.log('User deleted:', data.deletedUser);
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      const errorMessage = err.message || 'Unknown error occurred';
      alert(`Failed to delete user: ${errorMessage}`);
      console.error('Error deleting user:', err);
    } finally {
      setDeletingUserId(null);
    }
  };

  const viewUserDashboard = (userId) => {
    setSelectedUserId(userId);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching users from admin API...');
      
      const response = await fetch('http://localhost:5000/api/users/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Failed to fetch users`);
      }
      
      // Handle the new response format
      if (data.success && data.users) {
        console.log(`Successfully fetched ${data.count} users from MongoDB`);
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        // Fallback for old format
        console.log(`Fetched ${data.length} users (legacy format)`);
        setUsers(data);
      } else {
        throw new Error('Invalid response format from server');
      }
      
      setError(null);
    } catch (err) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching users:', err);
      
      // Show more specific error messages
      if (errorMessage.includes('Database not connected')) {
        setError('Database connection failed. Please check if MongoDB is running.');
      } else if (errorMessage.includes('401')) {
        setError('Authentication failed. Please log in again.');
      } else if (errorMessage.includes('503')) {
        setError('Database service unavailable. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedUsers = users
    .filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Show user dashboard if a user is selected
  if (selectedUserId) {
    return (
      <UserDashboard 
        userId={selectedUserId} 
        token={token} 
        onBack={() => setSelectedUserId(null)} 
      />
    );
  }

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
        <div>Loading users...</div>
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
          onClick={fetchUsers}
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
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1e293b',
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              👑 Admin Panel
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Manage all registered users from MongoDB database
            </p>
          </div>
          <button
            onClick={() => {
              checkDatabaseHealth();
              fetchUsers();
            }}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            {loading ? '⏳' : '🔄'} {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
        
        {/* Database Status */}
        <div style={{ 
          padding: '0.75rem 1rem', 
          borderRadius: '8px', 
          background: dbStatus.connected ? '#dcfce7' : '#fef3c7',
          border: `1px solid ${dbStatus.connected ? '#16a34a' : '#f59e0b'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>
            {dbStatus.connected ? '✅' : '⚠️'}
          </span>
          <span style={{ color: dbStatus.connected ? '#166534' : '#92400e' }}>
            {dbStatus.connected 
              ? `MongoDB Connected - ${dbStatus.userCount} total users in database` 
              : `MongoDB ${dbStatus.status} - Database connection issue`
            }
          </span>
          <button
            onClick={checkDatabaseHealth}
            style={{
              marginLeft: 'auto',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              background: 'transparent',
              border: '1px solid currentColor',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            🔄 Check
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search users by name, email, occupation, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '1rem',
              outline: 'none'
            }}
          >
            <option value="createdAt">Created Date</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="occupation">Occupation</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{users.length}</div>
          <div>Total Users</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {users.filter(u => u.occupation).length}
          </div>
          <div>With Occupation</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {users.filter(u => u.location).length}
          </div>
          <div>With Location</div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ 
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          overflowX: 'auto'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Password</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Occupation</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Created</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((user, index) => (
                <tr 
                  key={user._id} 
                  style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    background: index % 2 === 0 ? '#fff' : '#f8fafc'
                  }}
                >
                  <td style={{ padding: '1rem', fontWeight: '500' }}>
                    {user.name || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{user.email || 'N/A'}</span>
                      {user.email && (
                        <button
                          onClick={() => copyToClipboard(user.email)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: '#667eea'
                          }}
                          title="Copy email"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        fontFamily: 'monospace',
                        background: '#f1f5f9',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {user.password ? '••••••••' : 'N/A'}
                      </span>
                      {user.password && (
                        <button
                          onClick={() => copyToClipboard(user.password)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: '#667eea'
                          }}
                          title="Copy password"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {user.occupation || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {user.location || 'N/A'}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => viewUserDashboard(user._id)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        📊 Dashboard
                      </button>
                      
                      <button
                        onClick={() => deleteUser(user._id, user.name)}
                        disabled={deletingUserId === user._id}
                        style={{
                          background: deletingUserId === user._id 
                            ? '#94a3b8' 
                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: deletingUserId === user._id ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        {deletingUserId === user._id ? '⏳' : '🗑️'} Delete
                      </button>
                      
                      <button
                        onClick={() => {
                          const userInfo = `Name: ${user.name}\nEmail: ${user.email}\nPassword: ${user.password}\nOccupation: ${user.occupation}\nLocation: ${user.location}\nCreated: ${formatDate(user.createdAt)}`;
                          copyToClipboard(userInfo);
                          alert('User info copied to clipboard!');
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        📋 Copy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedUsers.length === 0 && (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#64748b',
            fontSize: '1.1rem'
          }}>
            No users found matching your search criteria.
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
        <strong>⚠️ Admin Access:</strong> This page displays sensitive user information. 
        Ensure proper access controls are in place in production.
      </div>
    </div>
  );
};

export default Admin;
