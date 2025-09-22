// Simple script to show all users in the database
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const showUsers = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack';
    await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('📭 No users found in database');
      console.log('💡 You need to create a user first through the signup process');
    } else {
      console.log(`👥 Found ${users.length} user(s):`);
      console.log('=====================================');
      
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Password: ${user.password ? '***' + user.password.slice(-4) : 'No password'}`);
        console.log(`  Created: ${user.createdAt}`);
      });
      
      console.log('\n🔑 To access admin panel:');
      console.log('1. Use any of the above email/password combinations');
      console.log('2. Login to the application');
      console.log('3. Click the Admin tab (👑)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
};

showUsers();
