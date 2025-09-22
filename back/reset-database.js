// Script to reset database and create admin user
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const resetDatabase = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Drop the problematic index
    console.log('🔧 Fixing database indexes...');
    try {
      await User.collection.dropIndex('emailId_1');
      console.log('✅ Dropped problematic index');
    } catch (err) {
      console.log('ℹ️ Index already dropped or doesn\'t exist');
    }
    
    // Clear all users
    console.log('🧹 Clearing all users...');
    await User.deleteMany({});
    console.log('✅ All users cleared');
    
    // Create admin user
    console.log('➕ Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@fintrack.com',
      password: hashedPassword,
      occupation: 'System Administrator',
      location: 'System',
      bio: 'System administrator with full access to all user data'
    });
    
    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    
    // Verify the user was created
    const createdUser = await User.findOne({ email: 'admin@fintrack.com' });
    console.log('\n👤 Admin User Details:');
    console.log(`ID: ${createdUser._id}`);
    console.log(`Name: ${createdUser.name}`);
    console.log(`Email: ${createdUser.email}`);
    console.log(`Created: ${createdUser.createdAt}`);
    
    console.log('\n🔑 ADMIN CREDENTIALS:');
    console.log('====================');
    console.log('Email: admin@fintrack.com');
    console.log('Password: admin123');
    console.log('Name: Admin User');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Start backend server: npm start');
    console.log('2. Start frontend: cd ../frontend && npm run dev');
    console.log('3. Login with admin credentials');
    console.log('4. Click Admin tab (👑) to access admin panel');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
};

resetDatabase();
