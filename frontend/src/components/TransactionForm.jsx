import React, { useState } from 'react'

const TransactionForm = ({ onAddTransaction, limits = {}, expensesByCategory = {} }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  })

  const expenseCategories = ['Food', 'Transportation', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Other']
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) {
      alert('Please fill all fields');
      return;
    }
    // Check limit for expenses
    if (formData.type === 'expense') {
      const limit = limits[formData.category] || Infinity;
      const spent = expensesByCategory[formData.category] || 0;
      const newAmount = parseFloat(formData.amount);
      if (spent + newAmount > limit) {
        alert(`Cannot add transaction: limit for ${formData.category} is ₹${limit.toLocaleString()} and you have already spent ₹${spent.toLocaleString()}.`);
        return;
      }
    }
    // Get geolocation
    let location = null;
    if (navigator.geolocation) {
      try {
        location = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
            (err) => resolve(null),
            { enableHighAccuracy: true, timeout: 5000 }
          );
        });
      } catch (e) { location = null; }
    }
    // Await the result in case onAddTransaction is async
    const result = await onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      location
    });
    if (result && result.success === false) {
      alert(result.message || 'Failed to add transaction');
      return;
    }
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: ''
    });
    alert('Transaction added successfully!');
  };

  const categories = formData.type === 'expense' ? expenseCategories : incomeCategories

  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h2>Add New Transaction</h2>
        <p>Track your income and expenses</p>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label>Transaction Type</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
              />
              <span className="radio-label expense">💸 Expense</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
              />
              <span className="radio-label income">💰 Income</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          ➕ Add Transaction
        </button>
      </form>
    </div>
  )
}

import Footer from './Footer';

const TransactionFormWithFooter = (props) => (
  <>
    <TransactionForm {...props} />
    <Footer />
  </>
);

export default TransactionFormWithFooter;