import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

const Reports = ({ transactions }) => {
  const [mode, setMode] = useState('daily');
  const today = new Date();

  let filtered = [];
  let label = '';

  if (mode === 'daily') {
    filtered = transactions.filter(t => isSameDay(new Date(t.date), today));
    label = format(today, 'yyyy-MM-dd');
  } else if (mode === 'weekly') {
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    filtered = transactions.filter(t => isWithinInterval(new Date(t.date), { start, end }));
    label = `${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`;
  } else if (mode === 'monthly') {
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    filtered = transactions.filter(t => isWithinInterval(new Date(t.date), { start, end }));
    label = format(today, 'MMMM yyyy');
  }

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={{
      maxWidth: 700,
      margin: '40px auto',
      padding: 0,
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 8px 32px rgba(60, 72, 100, 0.12)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      border: '1px solid #e5e7eb',
      minHeight: 520,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{padding: 0}}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#22223b',
          margin: 0,
          padding: '32px 32px 0 32px',
          textAlign: 'left',
          letterSpacing: 0.5,
        }}>Reports</h2>
        <div style={{padding: '24px 32px 0 32px'}}>
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => setMode('daily')} style={{ marginRight: 8, background: mode==='daily'?'#667eea':'#e2e8f0', color: mode==='daily'?'#fff':'#222', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Daily</button>
            <button onClick={() => setMode('weekly')} style={{ marginRight: 8, background: mode==='weekly'?'#667eea':'#e2e8f0', color: mode==='weekly'?'#fff':'#222', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Weekly</button>
            <button onClick={() => setMode('monthly')} style={{ background: mode==='monthly'?'#667eea':'#e2e8f0', color: mode==='monthly'?'#fff':'#222', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Monthly</button>
          </div>
          <div style={{ marginBottom: 8 }}><strong>Period:</strong> {label}</div>
          <div style={{ marginBottom: 8 }}><strong>Total Income:</strong> <span style={{ color: '#16a34a' }}>₹{totalIncome.toLocaleString()}</span></div>
          <div style={{ marginBottom: 8 }}><strong>Total Expense:</strong> <span style={{ color: '#dc2626' }}>₹{totalExpense.toLocaleString()}</span></div>
          <div style={{ marginBottom: 8 }}><strong>Net:</strong> <span style={{ color: totalIncome-totalExpense>=0?'#16a34a':'#dc2626' }}>₹{(totalIncome-totalExpense).toLocaleString()}</span></div>
          <div style={{ marginTop: 12 }}>
            <strong>Transactions:</strong>
            {filtered.length === 0 ? (
              <div style={{ color: '#888' }}>No transactions</div>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {filtered.map((t, i) => (
                  <li key={i} style={{ marginBottom: 8, padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: 4, border: 'none', fontSize: '0.95rem' }}>
                    <span style={{ color: t.type === 'income' ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()} {t.category}
                    </span>{' '}
                    <span style={{ color: '#555' }}>({t.description})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 800px) {
          .reports-page {
            font-size: 13px;
          }
        }
        @media (max-width: 600px) {
          .reports-page > div {
            max-width: 100vw !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
