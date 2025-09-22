import express from 'express';
import jwt from 'jsonwebtoken';
import RecurringPayment from '../models/RecurringPayment.js';
import User from '../models/User.js';

const router = express.Router();

// Auth middleware
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

// Get all recurring payments for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const recs = await RecurringPayment.find({ user: req.userId }).sort({ dueDate: 1 });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new recurring payment
router.post('/', auth, async (req, res) => {
  const { name, amount, dueDate, frequency, type } = req.body;
  try {
    const rec = await RecurringPayment.create({
      user: req.userId,
      name,
      amount,
      dueDate,
      frequency,
      type,
    });
    res.status(201).json(rec);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a recurring payment
router.put('/:id', auth, async (req, res) => {
  try {
    const rec = await RecurringPayment.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!rec) return res.status(404).json({ message: 'Not found' });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a recurring payment
router.delete('/:id', auth, async (req, res) => {
  try {
    const rec = await RecurringPayment.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!rec) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
