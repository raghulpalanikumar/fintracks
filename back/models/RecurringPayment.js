import mongoose from 'mongoose';

const recurringPaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  frequency: { type: String, enum: ['monthly', 'weekly', 'yearly'], required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
}, { timestamps: true });

export default mongoose.model('RecurringPayment', recurringPaymentSchema);
