// Script to fix database issues and create admin user
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixDatabase = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clean up users with null emails
    console.log('🧹 Cleaning up invalid users...');
    const deleteResult = await User.deleteMany({
      $or: [
        { email: null },
        { email: undefined },
        { email: '' },
        { name: null },
        { name: undefined },
        { name: '' }
      ]
    });
    
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} invalid users`);
    
    // Create admin user
    const adminEmail = 'admin@fintrack.com';
    const adminPassword = 'admin123';
    
    // Check if admin exists
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (adminUser) {
      console.log('⚠️ Admin user already exists, updating...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.findByIdAndUpdate(adminUser._id, {
        name: 'Admin User',
        password: hashedPassword,
        occupation: 'System Administrator',
        location: 'System',
        bio: 'System administrator with full access'
      });
    } else {
      console.log('➕ Creating new admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        occupation: 'System Administrator',
        location: 'System',
        bio: 'System administrator with full access'
      });
      
      await adminUser.save();
    }
    
    // Show all remaining users
    const allUsers = await User.find({});
    console.log(`\n👥 Total users in database: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Created: ${user.createdAt}`);
    });
    
    console.log('\n🔑 ADMIN CREDENTIALS:');
    console.log('====================');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Name: Admin User`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
};

fixDatabase();
