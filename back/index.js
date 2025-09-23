import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import remindersRoutes from './routes/reminders.js';
import recurringRoutes from './routes/recurring.js';
import userRoutes from './routes/users.js';
import aiFinanceRoutes from './routes/ai-finance.js';

dotenv.config();

const app = express();

// Normalize any accidental double slashes in request URLs
app.use((req, res, next) => {
  if (typeof req.url === 'string') {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});

// 🔥 Allow everyone (since you want the project to be public)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

// Increase payload size limit for JSON bodies
app.use(express.json({ limit: '2mb' }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai-finance', aiFinanceRoutes);

const PORT = process.env.PORT || 5000;

// Check if MongoDB URI is available
if (!process.env.MONGO_URI) {
  console.warn('Warning: MONGO_URI not found in environment variables. Using default localhost connection.');
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
      app.listen(PORT + 1, () => {
        console.log(`Server running on port ${PORT + 1}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.log('Starting server without database connection...');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (without database)`);
  });
});
