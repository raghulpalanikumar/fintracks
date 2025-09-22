import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    accuracy: { type: Number }
  },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
