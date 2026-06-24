import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const seed = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing users...');
    await User.deleteMany({});

    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: 'contactcobrix@gmail.com',
      password: 'Cobrix@889900',
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    contactcobrix@gmail.com');
    console.log('🔑 Password: Cobrix@889900');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();