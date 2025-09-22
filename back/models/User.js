import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  occupation: { type: String },
  location: { type: String },
  bio: { type: String },
  photo: { type: String },
  socials: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
