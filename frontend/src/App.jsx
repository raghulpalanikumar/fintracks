import CalendarView from './components/CalendarView';
import Reports from './components/Reports';
import Profile from './components/Profile';

import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
// import Summary from './components/Summary';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import Navbar from './components/Navbar';
import { exportTransactionsToCSV, importTransactionsFromCSV } from './utils/csv';
import Login from './components/Login';
import Signup from './components/Signup';
import FinanceAssistant from './components/FinanceAssistant';
import Home from './components/Home';
import Admin from './components/Admin';



function App() {
  // Load from localStorage if available
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [showLogin, setShowLogin] = useState(() => !localStorage.getItem('user'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));


  // Add transaction to backend
  const addTransaction = async (transaction) => {
    if (!token) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions([data, ...transactions]);
      } else {
        alert(data.message || 'Failed to add transaction');
      }
    } catch (err) {
      alert('Failed to add transaction');
    }
  };


  // Delete transaction from backend
  const deleteTransaction = async (id) => {
    if (!token) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setTransactions(transactions.filter((t) => t._id !== id));
      } else {
        alert('Failed to delete transaction');
      }
    } catch (err) {
      alert('Failed to delete transaction');
    }
  };


  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
    setShowLogin(false);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setActiveTab('home');
  };

  const handleSignup = (data) => {
    setUser(data.user);
    setToken(data.token);
    setShowLogin(false);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setTransactions([]);
    setShowLogin(true);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('activeTab');
  };
  // Fetch transactions after login
  useEffect(() => {
    if (token) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/api/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTransactions(data);
        });
    }
  }, [token]);


  // Persist activeTab in localStorage
  React.useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Get limits and expensesByCategory from localStorage and transactions
  const DEFAULT_LIMITS = {
    Food: 5000,
    Transportation: 2000,
    Rent: 10000,
    Utilities: 3000,
    Entertainment: 1500,
    Shopping: 2500,
    Healthcare: 2000,
    Other: 1000
  };
  const limits = (() => {
    const stored = localStorage.getItem('expenseLimits');
    return stored ? JSON.parse(stored) : DEFAULT_LIMITS;
  })();
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const renderContent = () => {
    if (activeTab === 'home') {
      return <Home 
        onLoginClick={() => {
          setUser(null);
          setToken(null);
          setShowLogin(true);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }} 
        onSignupClick={() => {
          setUser(null);
          setToken(null);
          setShowLogin(false);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }} 
      />;
    }
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'add':
        return <TransactionForm onAddTransaction={addTransaction} limits={limits} expensesByCategory={expensesByCategory} />;
      case 'transactions':
        return <TransactionList transactions={transactions} onDelete={deleteTransaction} />;
      case 'summary':
        return <Summary transactions={transactions} />;
      case 'calendar':
        return <CalendarView transactions={transactions} />;
      case 'reports':
        return <Reports transactions={transactions} />;
      case 'assistant':
        return <FinanceAssistant transactions={transactions} />;
      case 'profile':
        return <Profile />;
      case 'admin':
        // Only allow admin user to access Admin panel
        if (user && user.email === 'admin@fintrack.com') {
          return <Admin token={token} />;
        } else {
          return <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>Access denied. Admins only.</div>;
        }
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  if (!user) {
    if (showLogin === 'home') {
      return <Home onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowLogin(false)} />;
    }
    return showLogin ? (
      <Login onLogin={handleLogin} switchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSignup={handleSignup} switchToLogin={() => setShowLogin(true)} />
    );
  }

  // Export handler
  const handleExport = () => {
    exportTransactionsToCSV(transactions);
  };

  // Import handler
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    importTransactionsFromCSV(file, (imported) => {
      // Optionally, send to backend. Here, just add to local state:
      setTransactions(prev => [...imported, ...prev]);
      alert('Imported ' + imported.length + ' transactions!');
    });
    // Reset file input so same file can be imported again if needed
    e.target.value = '';
  };

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #a855f7 100%)'
      }}
    >
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onExport={handleExport} onImport={handleImport} user={user} />
      <main className="main-content">
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 'bold', color: '#667eea', fontSize: '1.1rem' }}>Hello, {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '0.4rem 1rem', borderRadius: '6px', background: '#667eea', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default App