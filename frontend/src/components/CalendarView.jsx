import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';
import Footer from './Footer';

const CalendarView = ({ transactions = [] }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  // Memoize filtered transactions for performance
  const selectedDayTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      isSameDay(new Date(transaction.date), selectedDate)
    );
  }, [transactions, selectedDate]);

  // Auto-select today if transactions update and today has a transaction
  React.useEffect(() => {
    const hasTodayTransaction = transactions.some(transaction =>
      isSameDay(new Date(transaction.date), today)
    );
    if (hasTodayTransaction && !isSameDay(selectedDate, today)) {
      setSelectedDate(today);
    }
  }, [transactions]);

  // Memoize tile content function to prevent unnecessary re-renders
  const tileContent = useMemo(() => {
    return ({ date, view }) => {
      if (view === 'month') {
        const hasTransactions = transactions.some(transaction => 
          isSameDay(new Date(transaction.date), date)
        );
        return hasTransactions ? (
          <span style={{ color: '#16a34a', fontWeight: 'bold' }}>•</span>
        ) : null;
      }
      return null;
    };
  }, [transactions]);


  const containerStyle = {
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
  };

  const headerStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#22223b',
    margin: 0,
    padding: '32px 32px 0 32px',
    textAlign: 'left',
    letterSpacing: 0.5,
  };

  const transactionSectionStyle = {
    marginTop: 0,
    padding: '0 32px 32px 32px',
    backgroundColor: 'transparent',
    borderRadius: 0,
    border: 'none',
  };

  const transactionTitleStyle = {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: 12
  };

  const noTransactionsStyle = {
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 8
  };

  const transactionListStyle = {
    margin: 0,
    padding: 0,
    listStyle: 'none'
  };

  const transactionItemStyle = {
    marginBottom: 8,
    padding: '8px 12px',
    backgroundColor: 'white',
    borderRadius: 4,
    border: '1px solid #e5e7eb',
    fontSize: '0.875rem'
  };

  const getAmountStyle = (type) => ({
    color: type === 'income' ? '#16a34a' : '#dc2626',
    fontWeight: 500
  });

  const descriptionStyle = {
    color: '#6b7280',
    marginLeft: 4
  };

  return (
    <div style={containerStyle}>
      <div style={{padding: 0}}>
        <h2 style={headerStyle}>Calendar</h2>
        <div style={{padding: '24px 32px 0 32px'}}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="transaction-calendar"
            prev2Label={null}
            next2Label={null}
          />
        </div>
      </div>
      <div style={transactionSectionStyle}>
        <div style={{
          ...transactionTitleStyle,
          fontSize: '1.15rem',
          color: '#22223b',
          margin: '32px 0 16px 0',
          fontWeight: 700
        }}>
          Transactions on {format(selectedDate, 'MMMM dd, yyyy')}:
        </div>
        {selectedDayTransactions.length === 0 ? (
          <div style={noTransactionsStyle}>
            No transactions found for this date
          </div>
        ) : (
          <ul style={transactionListStyle}>
            {selectedDayTransactions.map((transaction, index) => (
              <li key={transaction.id || index} style={{
                ...transactionItemStyle,
                backgroundColor: '#f3f4f6',
                border: 'none',
                marginBottom: 10
              }}>
                <span style={getAmountStyle(transaction.type)}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()} {transaction.category}
                </span>
                {transaction.description && (
                  <span style={descriptionStyle}>
                    ({transaction.description})
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <style jsx>{`
        .transaction-calendar {
          width: 100%;
          border: none;
          border-radius: 0;
          box-shadow: none;
          background: #fff;
        }
        .transaction-calendar .react-calendar__navigation {
          margin-bottom: 12px;
        }
        .transaction-calendar .react-calendar__navigation button {
          font-size: 1.2rem;
          font-weight: 600;
          color: #22223b;
          background: none;
          border-radius: 6px;
          border: none;
          margin: 0 2px;
          padding: 6px 12px;
          transition: background 0.2s;
        }
        .transaction-calendar .react-calendar__navigation button:enabled:hover {
          background-color: #f3f4f6;
        }
        .transaction-calendar .react-calendar__tile {
          position: relative;
          border: none;
          background: #fff;
          padding: 12px 0;
          font-size: 15px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .transaction-calendar .react-calendar__tile:enabled:hover {
          background-color: #e0e7ef;
        }
        .transaction-calendar .react-calendar__tile--active {
          background-color: #2563eb !important;
          color: #fff;
        }
        .transaction-calendar .react-calendar__tile--active:enabled:hover {
          background-color: #1d4ed8 !important;
        }
        .transaction-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          font-weight: 600;
          color: #64748b;
          font-size: 1rem;
          background: #f3f4f6;
        }
        .transaction-calendar .react-calendar__month-view__days__day--weekend {
          color: #a855f7;
        }
        .transaction-calendar .react-calendar__tile--now {
          background: #e0e7ef;
          color: #22223b;
        }
        @media (max-width: 800px) {
          .transaction-calendar {
            font-size: 13px;
          }
        }
        @media (max-width: 600px) {
          .transaction-calendar {
            font-size: 12px;
          }
          .calendar-page > div {
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

const CalendarViewWithFooter = (props) => {
  return (
    <div className="calendar-page">
      <CalendarView {...props} />
      <Footer />
    </div>
  );
};

export default CalendarViewWithFooter;