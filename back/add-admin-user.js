// Simple script to add admin user
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const addAdminUser = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Admin credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@fintrack.com',
      password: 'admin123',
      occupation: 'System Administrator',
      location: 'System',
      bio: 'System administrator with full access'
    };
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      
      // Update password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await User.findByIdAndUpdate(existingAdmin._id, {
        password: hashedPassword,
        name: adminData.name,
        occupation: adminData.occupation,
        location: adminData.location,
        bio: adminData.bio
      });
      
      console.log('✅ Admin user updated!');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      
      const adminUser = new User({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        occupation: adminData.occupation,
        location: adminData.location,
        bio: adminData.bio
      });
      
      await adminUser.save();
      console.log('✅ Admin user created!');
    }
    
    console.log('\n🔑 ADMIN CREDENTIALS:');
    console.log('====================');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Name: ${adminData.name}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

addAdminUser();
