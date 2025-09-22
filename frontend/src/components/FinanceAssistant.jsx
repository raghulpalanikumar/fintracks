import React, { useState } from 'react';

const FinanceAssistant = ({ transactions }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI Finance Assistant. Ask me anything about your finances, budgeting, investments, or general financial questions. I can analyze your transaction data and provide personalized advice!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fallback responses for common finance questions
  const getFallbackResponse = (question, transactions) => {
    if (/^what is finance\??$|^define finance\??$|^explain finance\??$/i.test(question.trim())) {
      return "Finance is the management of money and other assets. It involves activities such as saving, investing, borrowing, budgeting, and planning for future expenses. Finance helps individuals and organizations make informed decisions about how to use resources to achieve their goals.";
    }
    const lowerQuestion = question.toLowerCase();
    // Helper for validated sum
    const sumByType = (type, txs = transactions) => txs
      .filter(t => t.type === type && typeof t.amount !== 'undefined' && !isNaN(Number(t.amount)))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Month-specific queries
    const monthMatch = lowerQuestion.match(/(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    if (monthMatch) {
      const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
      const monthIdx = monthNames.findIndex(m => m === monthMatch[1].toLowerCase());
      const now = new Date();
      const yearMatch = lowerQuestion.match(/(\d{4})/);
      const year = yearMatch ? Number(yearMatch[1]) : now.getFullYear();
      const monthTx = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === monthIdx && td.getFullYear() === year;
      });
      if (/income/.test(lowerQuestion)) {
        const income = sumByType('income', monthTx);
        return `Your income for ${monthNames[monthIdx][0].toUpperCase()+monthNames[monthIdx].slice(1)} ${year} is ₹${income.toLocaleString()}.`;
      }
      if (/expense|spent/.test(lowerQuestion)) {
        const expense = sumByType('expense', monthTx);
        return `Your expenses for ${monthNames[monthIdx][0].toUpperCase()+monthNames[monthIdx].slice(1)} ${year} are ₹${expense.toLocaleString()}.`;
      }
    }

    if (/balance|current balance|net balance/i.test(lowerQuestion)) {
      const totalIncome = sumByType('income');
      const totalExpense = sumByType('expense');
      const balance = totalIncome - totalExpense;
      return `Your current balance is ₹${balance.toLocaleString()}. Total income: ₹${totalIncome.toLocaleString()}, Total expenses: ₹${totalExpense.toLocaleString()}.`;
    }

    if (/total income/i.test(lowerQuestion)) {
      const totalIncome = sumByType('income');
      return `Your total income is ₹${totalIncome.toLocaleString()}.`;
    }

    if (/total expense|total spent/i.test(lowerQuestion)) {
      const totalExpense = sumByType('expense');
      return `Your total expenses are ₹${totalExpense.toLocaleString()}.`;
    }
    
    if (/savings|save|budget|income management|money management/i.test(lowerQuestion)) {
      return "To improve your savings and manage income better: 1) Track all expenses, 2) Set a monthly budget, 3) Prioritize essential spending, 4) Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Start by saving 10-20% of your income first.";
    }
    
    if (/investment|invest|grow money|wealth building/i.test(lowerQuestion)) {
      return "Start with emergency funds (3-6 months expenses), then consider low-risk options like mutual funds, government bonds, or index funds. Always research and never invest more than you can afford to lose. Consider starting with SIP (Systematic Investment Plans).";
    }
    
    if (/debt|loan|credit|borrow/i.test(lowerQuestion)) {
      return "Focus on high-interest debt first (credit cards, personal loans). Consider debt consolidation if you have multiple loans. Always pay more than minimum payments when possible. Create a debt payoff plan and stick to it.";
    }
    
    if (/hi|hello|hey/i.test(lowerQuestion)) {
      return "Hello! I'm your finance assistant. I can help you understand your spending patterns, calculate balances, and provide general financial advice. What would you like to know?";
    }
    
    if (/help|what can you do|capabilities/i.test(lowerQuestion)) {
      return "I can help you with: checking your balance, calculating income/expenses, budgeting tips, investment advice, debt management, and general financial guidance. Just ask!";
    }
    
    if (/expense|spending|cost/i.test(lowerQuestion)) {
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return `Your total expenses are ₹${totalExpense.toLocaleString()}. To reduce expenses: track spending, identify non-essential items, negotiate bills, and look for cheaper alternatives.`;
    }
    
    if (/income|earn|salary/i.test(lowerQuestion)) {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      return `Your total income is ₹${totalIncome.toLocaleString()}. To increase income: ask for raises, develop new skills, take on side projects, or explore passive income opportunities.`;
    }
    
    // Default response for unrecognized questions
    return "I can help you track your finances and provide general financial advice. Try asking about your balance, income, expenses, savings, investments, or general money management tips.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(msgs => [...msgs, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Call AI backend for intelligent response
      const res = await fetch('http://localhost:5000/api/ai-finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput, transactions })
      });
      
      const data = await res.json();
      
      if (res.ok && data.answer) {
        // AI response received successfully
        setMessages(msgs => [...msgs, { role: 'assistant', content: data.answer }]);
      } else {
        // AI failed, provide fallback response
        console.warn('AI response failed, using fallback:', data.error);
        const fallbackResponse = getFallbackResponse(currentInput, transactions);
        setMessages(msgs => [...msgs, { role: 'assistant', content: fallbackResponse }]);
      }
    } catch (err) {
      // Network error, provide fallback response
      console.error('AI request failed:', err);
      const fallbackResponse = getFallbackResponse(currentInput, transactions);
      setMessages(msgs => [...msgs, { role: 'assistant', content: fallbackResponse }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      <div className="finance-assistant-container" style={{maxWidth: 600, margin: '0 auto', padding: 24, background: 'rgba(255, 255, 255, 0.95)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(20px)'}}>
      <div style={{textAlign: 'center', marginBottom: 20}}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          🤖 AI Finance Assistant
        </h2>
        <p style={{color: '#64748b', fontSize: '0.9rem'}}>
          Powered by AI • Analyzes your transaction data • Provides personalized advice
        </p>
      </div>
      
      <div style={{marginBottom: 16, padding: 12, background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', borderRadius: 8, fontSize: 14, border: '1px solid #0ea5e9'}}>
        <strong>💡 AI Capabilities:</strong> I can analyze your spending patterns, provide budgeting advice, suggest investment strategies, answer financial questions, and help you understand your financial data. Ask me anything!
      </div>
      
      <div className="chat-window" style={{
        minHeight: 300, 
        maxHeight: 400,
        marginBottom: 16, 
        background: '#fff', 
        borderRadius: 12, 
        padding: 16, 
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        border: '1px solid #e2e8f0'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: 12,
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#f1f5f9',
              color: msg.role === 'user' ? '#fff' : '#1e293b',
              fontSize: '14px',
              lineHeight: '1.4',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{fontWeight: '600', fontSize: '12px', opacity: 0.8, marginBottom: '4px'}}>
                {msg.role === 'user' ? 'You' : '🤖 AI Assistant'}
              </div>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 12
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 4px',
              background: '#f1f5f9',
              color: '#64748b',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{fontWeight: '600', fontSize: '12px', opacity: 0.8}}>🤖 AI Assistant</div>
              <div style={{display: 'flex', gap: '4px'}}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#667eea',
                  animation: 'pulse 1.4s ease-in-out infinite both'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#667eea',
                  animation: 'pulse 1.4s ease-in-out infinite both',
                  animationDelay: '0.2s'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#667eea',
                  animation: 'pulse 1.4s ease-in-out infinite both',
                  animationDelay: '0.4s'
                }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSend} style={{
        display: 'flex', 
        gap: 12,
        background: '#fff',
        borderRadius: 12,
        padding: '4px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything about your finances..."
          style={{
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: 8, 
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            background: 'transparent'
          }}
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()} 
          style={{
            padding: '12px 20px', 
            borderRadius: 8, 
            background: loading || !input.trim() 
              ? '#94a3b8' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', 
            border: 'none',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          {loading ? '⏳' : '🚀'} {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      
      <div style={{
        fontSize: 12, 
        color: '#64748b', 
        marginTop: 12, 
        textAlign: 'center',
        padding: '8px',
        background: '#f8fafc',
        borderRadius: 8
      }}>
        🤖 <strong>AI-Powered:</strong> Analyzes your transaction data • Provides personalized financial advice • Always learning
      </div>
      </div>
    </>
  );
};

import Footer from './Footer';

const FinanceAssistantWithFooter = (props) => (
  <>
    <FinanceAssistant {...props} />
    <Footer />
  </>
);

export default FinanceAssistantWithFooter;
