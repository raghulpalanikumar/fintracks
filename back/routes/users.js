import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// JWT authentication middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ Get current user's profile (must be before /:id)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('GET /me error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Update current user's profile (must be before /:id)
router.put('/me', auth, async (req, res) => {
  try {
    const update = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      update,
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('PUT /me error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🔻 These should come AFTER the /me routes

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile by ID
router.put('/:id', async (req, res) => {
  try {
    const update = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Database health check for admin
router.get('/admin/health', auth, async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const userCount = isConnected ? await User.countDocuments() : 0;
    
    res.json({
      success: true,
      database: {
        connected: isConnected,
        status: isConnected ? 'Connected' : 'Disconnected',
        userCount: userCount,
        connectionState: mongoose.connection.readyState
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      database: {
        connected: false,
        status: 'Error',
        error: err.message
      }
    });
  }
});

// Admin route to delete a user
router.delete('/admin/:userId', auth, async (req, res) => {
  try {
    console.log('Admin deleting user:', req.params.userId);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected', 
        error: 'MongoDB connection is not established' 
      });
    }

    const userId = req.params.userId;
    
    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    console.log(`User ${user.email} deleted successfully`);
    
    res.json({
      success: true,
      message: `User ${user.email} deleted successfully`,
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('DELETE /admin/:userId error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      details: 'Failed to delete user from MongoDB'
    });
  }
});

// Admin route to get user transactions for dashboard view
router.get('/admin/:userId/transactions', auth, async (req, res) => {
  try {
    console.log('Admin viewing transactions for user:', req.params.userId);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected', 
        error: 'MongoDB connection is not established' 
      });
    }

    const userId = req.params.userId;
    
    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Import Transaction model
    const Transaction = (await import('../models/Transaction.js')).default;
    
    // Get user's transactions
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    
    console.log(`Found ${transactions.length} transactions for user ${user.email}`);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        occupation: user.occupation,
        location: user.location
      },
      transactions: transactions,
      count: transactions.length
    });
  } catch (err) {
    console.error('GET /admin/:userId/transactions error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      details: 'Failed to fetch user transactions'
    });
  }
});

// Admin route to get all users (including passwords for admin purposes)
router.get('/admin/all', auth, async (req, res) => {
  try {
    console.log('Admin route accessed by user:', req.userId);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected', 
        error: 'MongoDB connection is not established' 
      });
    }

    // Fetch all users from MongoDB
    const users = await User.find({})
      .select('name email password occupation location bio createdAt updatedAt')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`Found ${users.length} users in database`);
    
    // Log user details for debugging
    console.log('=== USER DETAILS FROM MONGODB ===');
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  - Name: ${user.name}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Password: ${user.password ? '***' + user.password.slice(-4) : 'No password'}`);
      console.log(`  - Occupation: ${user.occupation || 'Not set'}`);
      console.log(`  - Location: ${user.location || 'Not set'}`);
      console.log(`  - Created: ${user.createdAt}`);
      console.log('---');
    });
    console.log('=== END USER DETAILS ===');

    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (err) {
    console.error('GET /admin/all error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      details: 'Failed to fetch users from MongoDB'
    });
  }
});

export default router;
