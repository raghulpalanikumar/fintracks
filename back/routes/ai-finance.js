import express from 'express';
import axios from 'axios';
const router = express.Router();

// POST /api/ai-finance
router.post('/', async (req, res) => {
  const { question, transactions } = req.body;
  
  console.log('AI Finance request received:', { question, transactionCount: transactions?.length || 0 });
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('OpenAI API key not set, using fallback response');
    return res.status(500).json({ error: 'AI service not available. Please check configuration.' });
  }

  // Analyze transaction data for context
  let transactionSummary = '';
  if (transactions && transactions.length > 0) {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    const categories = [...new Set(transactions.filter(t => t.category).map(t => t.category))];
    
    transactionSummary = `
User's Financial Data:
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpense.toLocaleString()}
- Net Balance: ₹${(totalIncome - totalExpense).toLocaleString()}
- Spending Categories: ${categories.join(', ')}
- Total Transactions: ${transactions.length}
`;
  } else {
    transactionSummary = 'User has no transaction data yet.';
  }

  // Create a comprehensive prompt
  const systemPrompt = `You are an expert financial advisor and AI assistant. You help users with:
- Personal finance management
- Budgeting and expense tracking
- Investment advice
- Financial planning
- Money management tips
- Analysis of spending patterns

Always provide practical, actionable advice. Be encouraging and supportive while being honest about financial realities.`;

  const userPrompt = `User Question: "${question}"

${transactionSummary}

Please provide a helpful, personalized response based on the user's question and financial data. Keep your response conversational, practical, and under 200 words.`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const aiMessage = response.data.choices[0].message.content;
    console.log('AI response generated successfully');
    res.json({ answer: aiMessage });
  } catch (err) {
    console.error('OpenAI API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI service temporarily unavailable. Please try again later.' });
  }
});

export default router;
