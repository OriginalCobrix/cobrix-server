import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    
    console.log(`📦 Found ${orders.length} orders:\n`);
    
    orders.forEach((order, i) => {
      console.log(`━━━ Order ${i + 1} ━━━`);
      console.log(`ID: ${order._id}`);
      console.log(`Customer: ${order.customerName} (${order.email})`);
      console.log(`Project: ${order.projectType}`);
      console.log(`Status: ${order.status}`);
      console.log(`Progress: ${order.completionPercentage}%`);
      console.log(`Payment: ${order.paymentStatus}`);
      console.log(`Notes: ${order.notes || '(none)'}`);
      console.log(`Admin Updates: ${order.adminUpdates?.length || 0}`);
      
      if (order.adminUpdates && order.adminUpdates.length > 0) {
        console.log('\n📝 Updates:');
        order.adminUpdates.forEach((update, j) => {
          console.log(`  ${j + 1}. ${update.message}`);
          console.log(`     Status: ${update.status}`);
          console.log(`     Time: ${new Date(update.timestamp).toLocaleString()}`);
        });
      } else {
        console.log('\n⚠️  NO ADMIN UPDATES FOUND');
      }
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

debug();