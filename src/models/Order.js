import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: String,
  projectType: { type: String, required: true },
  description: { type: String, required: true },
  features: [String],
  budget: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  
  // ✅ Enhanced status system
  status: {
    type: String,
    enum: [
      'pending',           // Just received
      'reviewing',         // Admin reviewing
      'approved',          // Approved, not started
      'working',           // Work in progress
      'in-progress',       // Same as working (legacy)
      'fifty-percent',     // 50% done
      'seventy-percent',   // 70% done
      'ninety-percent',    // 90% done
      'testing',           // In testing phase
      'completed',         // Fully done
      'delivered',         // Delivered to client
      'rejected'           // Rejected
    ],
    default: 'pending'
  },
  
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  paymentAmount: { type: Number, default: 0 },
  
  // ✅ Admin notes with history
  notes: { type: String, default: '' },
  adminUpdates: [{
    message: String,
    status: String,
    timestamp: { type: Date, default: Date.now },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);