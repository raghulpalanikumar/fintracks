import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Backend email reminder API
async function sendReminderEmail(token, reminders) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/reminders/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ reminders }),
  });
  if (!res.ok) throw new Error('Failed to send reminder email');
  return res.json();
}
import { exportTransactionsToCSV, importTransactionsFromCSV } from '../utils/csv';
// Helper to get monthly stats for the last 6 months
function getMonthlyStats(transactions, months = 6) {
  const now = new Date();
  const stats = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth();
    const year = d.getFullYear();
    const monthTx = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === month && td.getFullYear() === year;
    });
    const income = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    stats.push({
      label: `${d.toLocaleString('default', { month: 'short' })} '${String(year).slice(-2)}`,
      income,
      expense
    });
  }
  return stats;
}

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


// Recurring Payment Reminder Types
const RECURRING_STORAGE_KEY = 'recurringPayments';
const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' },
];

import CalendarView from './CalendarView';
import Reports from './Reports';

const Summary = ({ transactions }) => {
  const [view, setView] = useState('summary'); // 'summary', 'calendar', 'reports'
  const [limits, setLimits] = useState(() => {
    const stored = localStorage.getItem('expenseLimits');
    return stored ? JSON.parse(stored) : DEFAULT_LIMITS;
  });

  // Recurring payments state
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [recurringForm, setRecurringForm] = useState({
    name: '',
    amount: '',
    dueDate: '',
    frequency: 'monthly',
    type: 'expense',
  });
  const [reminders, setReminders] = useState([]);

  // Fetch recurring payments from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/recurring`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecurringPayments(data);
        } else {
          setRecurringPayments([]);
        }
      })
      .catch(() => setRecurringPayments([]));
  }, []);

  // Add or edit recurring payment (MongoDB)
  const handleRecurringSubmit = async (e) => {
    e.preventDefault();
    if (!recurringForm.name || !recurringForm.amount || !recurringForm.dueDate) return;
    const token = localStorage.getItem('token');
    if (recurringForm._id) {
      // Edit
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/recurring/${recurringForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(recurringForm),
      });
      const updated = await res.json();
      setRecurringPayments(list => list.map(r => r._id === updated._id ? updated : r));
    } else {
      // Add
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/recurring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(recurringForm),
      });
      const newRec = await res.json();
      setRecurringPayments(list => [...list, newRec]);
    }
    setRecurringForm({ name: '', amount: '', dueDate: '', frequency: 'monthly', type: 'expense' });
    setShowRecurringForm(false);
  };

  // Edit recurring payment
  const handleEditRecurring = (idx) => {
    setRecurringForm({ ...recurringPayments[idx], _id: recurringPayments[idx]._id });
    setShowRecurringForm(true);
  };

  // Delete recurring payment
  const handleDeleteRecurring = async (idx) => {
    if (!window.confirm('Delete this recurring payment?')) return;
    const token = localStorage.getItem('token');
    const rec = recurringPayments[idx];
    await fetch(`${import.meta.env.VITE_API_URL || ''}/api/recurring/${rec._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setRecurringPayments(list => list.filter((_, i) => i !== idx));
  };

  // Check for upcoming reminders (next 7 days)
  React.useEffect(() => {
    const now = new Date();
    const upcoming = recurringPayments.filter(rp => {
      if (!rp.dueDate) return false;
      const due = new Date(rp.dueDate);
      let nextDue = new Date(due);
      // Calculate next due date based on frequency
      while (nextDue < now) {
        if (rp.frequency === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1);
        else if (rp.frequency === 'weekly') nextDue.setDate(nextDue.getDate() + 7);
        else if (rp.frequency === 'yearly') nextDue.setFullYear(nextDue.getFullYear() + 1);
        else break;
      }
      // Show if due within 7 days
      const diff = (nextDue - now) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    });
    setReminders(upcoming);
  }, [recurringPayments]);

  const handleLimitChange = (category, value) => {
    const newLimits = { ...limits, [category]: Number(value) };
    setLimits(newLimits);
    localStorage.setItem('expenseLimits', JSON.stringify(newLimits));
  };
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear
  })

  // Ensure amount is a number and type is correct
  const totalIncome = transactions
    .filter(t => t.type === 'income' && typeof t.amount !== 'undefined' && !isNaN(Number(t.amount)))
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpense = transactions
    .filter(t => t.type === 'expense' && typeof t.amount !== 'undefined' && !isNaN(Number(t.amount)))
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const balance = totalIncome - totalExpense

  const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpense = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const monthlyBalance = monthlyIncome - monthlyExpense

  // Category analysis
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const topExpenseCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const topIncomeCategories = Object.entries(incomeByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0

  // Monthly stats for graph
  const monthlyStats = getMonthlyStats(transactions, 6);

  // Export handler
  const handleExport = () => {
    exportTransactionsToCSV(transactions);
  };

  // Import handler
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    importTransactionsFromCSV(file, (imported) => {
      alert('Imported ' + imported.length + ' transactions!');
    });
    e.target.value = '';
  };


  return (
    <div className="summary-container">
      {/* View Switcher */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setView('summary')}
          style={{
            padding: '8px 20px',
            borderRadius: 6,
            border: 'none',
            fontWeight: 'bold',
            background: view === 'summary' ? '#667eea' : '#e2e8f0',
            color: view === 'summary' ? '#fff' : '#222',
            cursor: 'pointer',
            boxShadow: view === 'summary' ? '0 2px 8px #c7d2fe' : 'none',
            transition: 'all 0.15s'
          }}
        >Summary</button>
        <button
          onClick={() => setView('calendar')}
          style={{
            padding: '8px 20px',
            borderRadius: 6,
            border: 'none',
            fontWeight: 'bold',
            background: view === 'calendar' ? '#667eea' : '#e2e8f0',
            color: view === 'calendar' ? '#fff' : '#222',
            cursor: 'pointer',
            boxShadow: view === 'calendar' ? '0 2px 8px #c7d2fe' : 'none',
            transition: 'all 0.15s'
          }}
        >Calendar</button>
        <button
          onClick={() => setView('reports')}
          style={{
            padding: '8px 20px',
            borderRadius: 6,
            border: 'none',
            fontWeight: 'bold',
            background: view === 'reports' ? '#667eea' : '#e2e8f0',
            color: view === 'reports' ? '#fff' : '#222',
            cursor: 'pointer',
            boxShadow: view === 'reports' ? '0 2px 8px #c7d2fe' : 'none',
            transition: 'all 0.15s'
          }}
        >Reports</button>
      </div>

      {/* Render selected view */}
      {view === 'summary' && (
        <>
          <div className="summary-header">
            <h2>Financial Summary & Analytics</h2>
            <p>Detailed insights into your financial health</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: 16, justifyContent: 'center' }}>
              <button onClick={handleExport} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, background: '#667eea', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>⬇️ Export CSV</button>
              <label style={{ cursor: 'pointer', marginBottom: 0, background: '#667eea', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: 6, fontWeight: 'bold' }}>
                ⬆️ Import CSV
                <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
              </label>
            </div>
          </div>

      {/* Recurring Payment Reminders */}
      <div className="summary-section" style={{ margin: '24px 0', background: '#f8fafc', borderRadius: 10, padding: 18, boxShadow: '0 1px 4px #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>🔔 Recurring Payment Reminders</h3>
          <div style={{display:'flex',gap:8}}>
            <button onClick={() => { setShowRecurringForm(!showRecurringForm); setRecurringForm({ name: '', amount: '', dueDate: '', frequency: 'monthly', type: 'expense' }); }} style={{ background: '#667eea', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{showRecurringForm ? 'Cancel' : 'Add'}</button>
            <button
              onClick={async () => {
                const token = localStorage.getItem('token');
                if (!token) return alert('Login required to send email reminders.');
                if (!reminders.length) return alert('No upcoming reminders to email.');
                try {
                  await sendReminderEmail(token, reminders);
                  alert('Reminder email sent!');
                } catch (e) {
                  alert('Failed to send email: ' + (e.message || e));
                }
              }}
              style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Email Reminders
            </button>
          </div>
        </div>
        {/* Reminders for upcoming payments */}
        {reminders.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <strong>Upcoming in 7 days:</strong>
            <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
              {reminders.map((rp, idx) => {
                const due = new Date(rp.dueDate);
                let nextDue = new Date(due);
                const now = new Date();
                while (nextDue < now) {
                  if (rp.frequency === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1);
                  else if (rp.frequency === 'weekly') nextDue.setDate(nextDue.getDate() + 7);
                  else if (rp.frequency === 'yearly') nextDue.setFullYear(nextDue.getFullYear() + 1);
                  else break;
                }
                return (
                  <li key={idx} style={{ color: rp.type === 'income' ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                    {rp.name} ({rp.type}) of ₹{Number(rp.amount).toLocaleString()} due on {nextDue.toLocaleDateString()} ({rp.frequency})
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* Recurring payment list */}
        {recurringPayments.length > 0 ? (
          <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px #e2e8f0', marginBottom: 8 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: 6, fontWeight: 600 }}>Name</th>
                <th style={{ padding: 6, fontWeight: 600 }}>Amount</th>
                <th style={{ padding: 6, fontWeight: 600 }}>Due Date</th>
                <th style={{ padding: 6, fontWeight: 600 }}>Frequency</th>
                <th style={{ padding: 6, fontWeight: 600 }}>Type</th>
                <th style={{ padding: 6, fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringPayments.map((rp, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 6 }}>{rp.name}</td>
                  <td style={{ padding: 6 }}>₹{Number(rp.amount).toLocaleString()}</td>
                  <td style={{ padding: 6 }}>{new Date(rp.dueDate).toLocaleDateString()}</td>
                  <td style={{ padding: 6 }}>{FREQUENCIES.find(f => f.value === rp.frequency)?.label || rp.frequency}</td>
                  <td style={{ padding: 6 }}>{rp.type}</td>
                  <td style={{ padding: 6 }}>
                    <button onClick={() => handleEditRecurring(idx)} style={{ marginRight: 8, background: '#fbbf24', color: '#222', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteRecurring(idx)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: '#888', marginBottom: 8 }}>No recurring payments set.</div>
        )}
        {/* Add/Edit Recurring Payment Form */}
        {showRecurringForm && (
          <form onSubmit={handleRecurringSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <input type="text" placeholder="Name" value={recurringForm.name} onChange={e => setRecurringForm(f => ({ ...f, name: e.target.value }))} required style={{ flex: '1 1 120px', padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
            <input type="number" placeholder="Amount" value={recurringForm.amount} onChange={e => setRecurringForm(f => ({ ...f, amount: e.target.value }))} required min={1} style={{ flex: '1 1 80px', padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
            <input type="date" value={recurringForm.dueDate} onChange={e => setRecurringForm(f => ({ ...f, dueDate: e.target.value }))} required style={{ flex: '1 1 140px', padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
            <select value={recurringForm.frequency} onChange={e => setRecurringForm(f => ({ ...f, frequency: e.target.value }))} style={{ flex: '1 1 100px', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}>
              {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <select value={recurringForm.type} onChange={e => setRecurringForm(f => ({ ...f, type: e.target.value }))} style={{ flex: '1 1 100px', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button type="submit" style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 'bold', cursor: 'pointer' }}>{recurringForm.editIndex !== undefined ? 'Update' : 'Add'}</button>
          </form>
        )}
      </div>

          <div className="summary-grid">
        {/* Monthly Income vs Expense Graph */}
        <div className="summary-section">
          <h3>📈 Monthly Income vs Expense (Last 6 Months)</h3>
          <div style={{height: 260, width: '100%', marginBottom: 8}}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" fill="#16a34a" name="Income" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#dc2626" name="Expense" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* ...existing code... */}
        {/* Overall Summary */}
        <div className="summary-section">
          <h3>📊 Overall Summary</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Total Income</span>
              <span className="stat-value income">₹{totalIncome.toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Total Expenses</span>
              <span className="stat-value expense">₹{totalExpense.toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Net Balance</span>
              <span className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                ₹{balance.toLocaleString()}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Savings Rate</span>
              <span className={`stat-value ${savingsRate >= 20 ? 'positive' : 'neutral'}`}>
                {savingsRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="summary-section">
          <h3>📅 {monthNames[currentMonth]} {currentYear}</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Monthly Income</span>
              <span className="stat-value income">₹{monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Monthly Expenses</span>
              <span className="stat-value expense">₹{monthlyExpense.toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Monthly Balance</span>
              <span className={`stat-value ${monthlyBalance >= 0 ? 'positive' : 'negative'}`}>
                ₹{monthlyBalance.toLocaleString()}
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Transactions</span>
              <span className="stat-value neutral">{monthlyTransactions.length}</span>
            </div>
          </div>
        </div>

        {/* Expense Limits & Graph */}
        <div className="summary-section">
          <h3>🚦 Expense Limits by Category</h3>
          <div style={{marginBottom: 16}}>
            {Object.keys(limits).map(category => (
              <div key={category} style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
                <span style={{minWidth:90}}>{category}</span>
                <input
                  type="number"
                  value={limits[category]}
                  min={0}
                  style={{width:80, borderRadius:4, border:'1px solid #ccc', padding:'2px 6px'}}
                  onChange={e => handleLimitChange(category, e.target.value)}
                />
                <span style={{fontSize:12, color:'#888'}}>Limit (₹)</span>
              </div>
            ))}
          </div>
          <div style={{height:260, overflowX:'auto'}}>
            <svg width="100%" height="220">
              {Object.keys(limits).map((category, i) => {
                const spent = expensesByCategory[category] || 0;
                const limit = limits[category];
                const percent = Math.min((spent / limit) * 100, 100);
                return (
                  <g key={category} transform={`translate(0,${i*28})`}>
                    <text x={0} y={18} fontSize={13} fill="#222">{category}</text>
                    <rect x={90} y={6} width={220} height={16} rx={8} fill="#e2e8f0" />
                    <rect x={90} y={6} width={2.2*percent} height={16} rx={8} fill={percent >= 100 ? '#dc2626' : '#667eea'} />
                    <text x={320} y={18} fontSize={13} fill={percent >= 100 ? '#dc2626' : '#222'}>
                      ₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Top Expense Categories */}
        <div className="summary-section">
          <h3>💸 Top Expense Categories</h3>
          {topExpenseCategories.length > 0 ? (
            <div className="category-breakdown">
              {topExpenseCategories.map(([category, amount], index) => (
                <div key={category} className="category-item">
                  <div className="category-rank">#{index + 1}</div>
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-amount">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="category-percentage">
                    {((amount / totalExpense) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No expense data available</p>
          )}
        </div>

        {/* Top Income Sources */}
        <div className="summary-section">
          <h3>💰 Top Income Sources</h3>
          {topIncomeCategories.length > 0 ? (
            <div className="category-breakdown">
              {topIncomeCategories.map(([category, amount], index) => (
                <div key={category} className="category-item">
                  <div className="category-rank">#{index + 1}</div>
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-amount">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="category-percentage">
                    {((amount / totalIncome) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No income data available</p>
          )}
        </div>

        {/* Financial Health */}
        <div className="summary-section">
          <h3>🏥 Financial Health</h3>
          <div className="health-indicators">
            <div className="health-item">
              <span className="health-label">Expense Ratio</span>
              <div className="health-bar">
                <div 
                  className="health-fill expense"
                  style={{width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%`}}
                ></div>
              </div>
              <span className="health-value">{totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}%</span>
            </div>
            <div className="health-item">
              <span className="health-label">Savings Rate</span>
              <div className="health-bar">
                <div 
                  className="health-fill positive"
                  style={{width: `${Math.max(savingsRate, 0)}%`}}
                ></div>
              </div>
              <span className="health-value">{savingsRate}%</span>
            </div>
          </div>
          
          <div className="health-tips">
            <h4>💡 Tips</h4>
            <ul>
              {savingsRate < 20 && <li>Try to save at least 20% of your income</li>}
              {totalExpense > totalIncome && <li>⚠️ Your expenses exceed your income</li>}
              {monthlyTransactions.length === 0 && <li>Start tracking your monthly transactions</li>}
              {savingsRate >= 20 && <li>✅ Great job maintaining a healthy savings rate!</li>}
            </ul>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="summary-section">
          <h3>⚡ Quick Stats</h3>
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-value">{transactions.length}</div>
              <div className="quick-stat-label">Total Transactions</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">
                ₹{transactions.length > 0 ? Math.round(totalExpense / transactions.filter(t => t.type === 'expense').length || 0) : 0}
              </div>
              <div className="quick-stat-label">Avg. Expense</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">
                ₹{transactions.length > 0 ? Math.round(totalIncome / transactions.filter(t => t.type === 'income').length || 0) : 0}
              </div>
              <div className="quick-stat-label">Avg. Income</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">{Object.keys(expensesByCategory).length}</div>
              <div className="quick-stat-label">Expense Categories</div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
      {view === 'calendar' && (
        <CalendarView transactions={transactions} />
      )}
      {view === 'reports' && (
        <Reports transactions={transactions} />
      )}
    </div>
  )
}

import Footer from './Footer';

const SummaryWithFooter = (props) => (
  <>
    <Summary {...props} />
    <Footer />
  </>
);

export default SummaryWithFooter;