import React, { useState } from 'react'

const TransactionList = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date)
      case 'amount':
        return b.amount - a.amount
      case 'category':
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(id)
    }
  }

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h2>Transaction History</h2>
        <p>Manage your financial records</p>
      </div>

      <div className="list-controls">
        <div className="filter-group">
          <label>Filter by type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      <div className="transaction-count">
        Showing {sortedTransactions.length} of {transactions.length} transactions
      </div>

      {sortedTransactions.length > 0 ? (
        <div className="transactions-grid">
          {sortedTransactions.map(transaction => (
            <div key={transaction._id || transaction.id} className={`transaction-card ${transaction.type}`}>
              <div className="transaction-header">
                <span className="transaction-type-badge">
                  {transaction.type === 'income' ? '💰' : '💸'} {transaction.type}
                </span>
                <span className="transaction-date">{formatDate(transaction.date)}</span>
              </div>
              
              <div className="transaction-body">
                <h4 className="transaction-category">{transaction.category}</h4>
                <p className="transaction-description">{transaction.description}</p>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </div>
              </div>

              <div className="transaction-actions">
                <button 
                  onClick={() => handleDelete(transaction._id || transaction.id)}
                  className="delete-btn"
                  title="Delete transaction"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-transactions">
          <div className="no-transactions-icon">📝</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add some transactions to get started.</p>
        </div>
      )}
    </div>
  )
}

import Footer from './Footer';

const TransactionListWithFooter = (props) => (
  <>
    <TransactionList {...props} />
    <Footer />
  </>
);

export default TransactionListWithFooter;