// Test script to verify MongoDB connection and user data
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Check connection status
    console.log('📊 Connection Status:', mongoose.connection.readyState);
    console.log('🗄️ Database Name:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Count total users
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);
    
    if (userCount > 0) {
      // Get all users
      const users = await User.find({}).select('name email password occupation location createdAt');
      
      console.log('\n📋 USER DETAILS:');
      console.log('================');
      
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Password: ${user.password ? '***' + user.password.slice(-4) : 'No password'}`);
        console.log(`  Occupation: ${user.occupation || 'Not set'}`);
        console.log(`  Location: ${user.location || 'Not set'}`);
        console.log(`  Created: ${user.createdAt}`);
      });
    } else {
      console.log('⚠️ No users found in database');
    }
    
    // Test admin route functionality
    console.log('\n🔧 Testing admin route functionality...');
    const adminUsers = await User.find({})
      .select('name email password occupation location bio createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Admin query successful - found ${adminUsers.length} users`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
testDatabaseConnection();
