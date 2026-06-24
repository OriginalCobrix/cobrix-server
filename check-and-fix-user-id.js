import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Order from './src/models/Order.js';

dotenv.config();

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find the user
    const user = await User.findOne({ email: 'khizer123@gmail.com' });
    
    if (!user) {
      console.log('❌ User khizer123@gmail.com not found!');
      console.log('👉 Please login with this email first');
      process.exit(1);
    }
    
    console.log('👤 User found:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}\n`);
    
    // Find ALL orders in database
    const allOrders = await Order.find({}).sort({ createdAt: -1 });
    console.log(`📦 Total orders in database: ${allOrders.length}`);
    
    // Find orders for this specific user
    const userOrders = await Order.find({ userId: user._id });
    console.log(`📦 Orders linked to this user: ${userOrders.length}\n`);
    
    // Find orders that need fixing (orders with this email but wrong userId)
    const ordersToFix = allOrders.filter(order => 
      order.email === 'khizer123@gmail.com' && 
      order.userId?.toString() !== user._id.toString()
    );
    
    if (ordersToFix.length === 0 && userOrders.length === 0) {
      console.log('⚠️  No orders found for this user.');
      console.log('👉 Please place an order first at /order');
      process.exit(0);
    }
    
    if (ordersToFix.length > 0) {
      console.log(`🔧 Found ${ordersToFix.length} orders to fix:\n`);
      
      ordersToFix.forEach((order, i) => {
        console.log(`${i + 1}. Order ${order.projectType}`);
        console.log(`   Current userId: ${order.userId || 'null'}`);
        console.log(`   Order email: ${order.email}`);
        console.log(`   Admin Updates: ${order.adminUpdates?.length || 0}`);
        console.log('');
      });
      
      // Fix them
      const result = await Order.updateMany(
        { email: 'khizer123@gmail.com', userId: { $ne: user._id } },
        { $set: { userId: user._id } }
      );
      
      console.log('✅ Successfully updated orders!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 Modified: ${result.modifiedCount} orders`);
      console.log(`📊 Matched: ${result.matchedCount} orders`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('✅ All orders are correctly linked!\n');
    }
    
    // Show final count
    const finalCount = await Order.countDocuments({ userId: user._id });
    console.log(`🎉 Final order count for ${user.email}: ${finalCount}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👉 NEXT STEPS:');
    console.log('   1. Refresh your browser (Ctrl+F5)');
    console.log('   2. Go to /my-orders');
    console.log('   3. You should now see your orders!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

fix();