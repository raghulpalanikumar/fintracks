// Script to create a dedicated admin user
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack';
    await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB');
    
    // Admin credentials
    const adminEmail = 'admin@fintrack.com';
    const adminPassword = 'admin123';
    const adminName = 'System Administrator';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`ID: ${existingAdmin._id}`);
      
      // Update the existing admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.findByIdAndUpdate(existingAdmin._id, {
        name: adminName,
        password: hashedPassword,
        occupation: 'System Administrator',
        location: 'System',
        bio: 'System administrator with full access to all user data'
      });
      
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        occupation: 'System Administrator',
        location: 'System',
        bio: 'System administrator with full access to all user data'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n🔑 ADMIN CREDENTIALS:');
    console.log('====================');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Name: ${adminName}`);
    console.log('\n📋 To access admin panel:');
    console.log('1. Start your backend server: npm start');
    console.log('2. Start your frontend: cd ../frontend && npm run dev');
    console.log('3. Login with the above credentials');
    console.log('4. Click the Admin tab (👑)');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
};

createAdminUser();
