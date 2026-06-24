import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';

dotenv.config();

const addTestUpdates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get the most recent order
    const order = await Order.findOne().sort({ createdAt: -1 });
    
    if (!order) {
      console.log('❌ No orders found. Please place an order first.');
      process.exit(1);
    }

    console.log(`📦 Adding test updates to order: ${order._id}`);
    console.log(`Customer: ${order.customerName} (${order.email})\n`);

    // Initialize adminUpdates array if it doesn't exist
    if (!order.adminUpdates) {
      order.adminUpdates = [];
    }

    // Add test updates (simulating admin workflow)
    const testUpdates = [
      {
        message: 'Your project has been reviewed and approved! We\'re excited to start working on it.',
        status: 'approved',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        message: 'Work has officially started! Our team is setting up the project architecture.',
        status: 'working',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        message: 'We\'ve completed the initial design mockups and core functionality. Moving to next phase.',
        status: 'fifty-percent',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        message: 'Great progress! 70% complete. Working on final integrations and testing.',
        status: 'seventy-percent',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        message: 'Almost done! 90% complete. Final polish and quality checks in progress.',
        status: 'ninety-percent',
        timestamp: new Date() // Now
      }
    ];

    testUpdates.forEach(update => {
      order.adminUpdates.push(update);
    });

    // Update order status and progress
    order.status = 'ninety-percent';
    order.completionPercentage = 90;
    order.paymentStatus = 'partial';
    order.paymentAmount = 2500;
    order.notes = 'Client prefers blue theme. Priority delivery requested.';

    await order.save();

    console.log('✅ Successfully added 5 test updates!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Final Status:');
    console.log(`   Status: ${order.status}`);
    console.log(`   Progress: ${order.completionPercentage}%`);
    console.log(`   Total Updates: ${order.adminUpdates.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('👉 Now login as the customer and visit /my-orders to see the updates!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addTestUpdates();