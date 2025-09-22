import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendRecurringReminder } from '../utils/email.js';

const router = express.Router();

// Auth middleware (reuse from transactions.js)
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

// POST /api/reminders/email
// Body: { reminders: [{ name, amount, dueDate, frequency, type }] }
// Email reminders for upcoming recurring payments (fetch from DB)
import RecurringPayment from '../models/RecurringPayment.js';
router.post('/email', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Use reminders from frontend if provided, else fallback to DB
    let reminders = req.body.reminders;
    if (!reminders || !reminders.length) {
      // fallback to DB (original logic)
      const now = new Date();
      const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      reminders = await RecurringPayment.find({
        user: req.userId,
        dueDate: { $gte: now, $lte: in7 }
      });
    }
    if (!reminders.length) return res.status(400).json({ message: 'No upcoming reminders' });
    const subject = 'Upcoming Recurring Payment Reminders';
    const text = reminders.map(r =>
      `${r.name} (${r.type}) of ₹${r.amount} due on ${new Date(r.dueDate).toLocaleDateString ? new Date(r.dueDate).toLocaleDateString() : r.dueDate} (${r.frequency})`
    ).join('\n');
    await sendRecurringReminder({ to: user.email, subject, text });
    res.json({ message: 'Reminder email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

export default router;
