import Order from '../models/Order.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create({
      ...req.body,
      userId: req.user?._id
    });

    // Email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🚀 New Project Order: ${order.projectType}`,
      html: `
        <div style="font-family:Arial;padding:20px;background:#0a0a0a;color:#fff;border-radius:10px">
          <h2 style="color:#3b82f6">New Order Received</h2>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Company:</strong> ${order.companyName || 'N/A'}</p>
          <p><strong>Project Type:</strong> ${order.projectType}</p>
          <p><strong>Budget:</strong> ${order.budget}</p>
          <p><strong>Delivery:</strong> ${order.deliveryTime}</p>
          <p><strong>Description:</strong> ${order.description}</p>
          <p><strong>Features:</strong> ${order.features?.join(', ') || 'N/A'}</p>
        </div>`
    });

    // Confirmation to customer
    await sendEmail({
      to: order.email,
      subject: '✅ Nexora Studio - Order Received',
      html: `
        <div style="font-family:Arial;padding:20px;background:#0a0a0a;color:#fff;border-radius:10px">
          <h2 style="color:#3b82f6">Thank you, ${order.customerName}!</h2>
          <p>We've received your project request and our team will review it shortly.</p>
          <p><strong>Project:</strong> ${order.projectType}</p>
          <p><strong>Budget:</strong> ${order.budget}</p>
          <p>We'll contact you within 24 hours.</p>
          <p style="color:#a855f7">— Nexora Studio Team</p>
        </div>`
    });

    res.status(201).json({ success: true, order });
  } catch (error) { next(error); }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find(req.user?.role === 'admin' ? {} : { userId: req.user?._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) { next(error); }
};

// ✅ Enhanced update with email notifications
export const updateOrder = async (req, res, next) => {
  try {
    const { notes, status, paymentStatus, paymentAmount, adminMessage } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update fields
    if (notes !== undefined) order.notes = notes;
    if (status !== undefined) order.status = status;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
    if (paymentAmount !== undefined) order.paymentAmount = paymentAmount;

    // Calculate completion percentage based on status
    const statusPercentages = {
      'pending': 0,
      'reviewing': 5,
      'approved': 10,
      'working': 25,
      'in-progress': 25,
      'fifty-percent': 50,
      'seventy-percent': 70,
      'ninety-percent': 90,
      'testing': 95,
      'completed': 100,
      'delivered': 100,
      'rejected': 0
    };
    if (status && statusPercentages[status] !== undefined) {
      order.completionPercentage = statusPercentages[status];
    }

    // Add admin update to history
    if (adminMessage || status) {
      order.adminUpdates.push({
        message: adminMessage || `Status updated to: ${status}`,
        status: status,
        by: req.user?._id
      });
    }

    await order.save();

    // ✅ Send email notification to customer
    if (adminMessage || status) {
      const statusLabels = {
        'pending': 'Pending Review',
        'reviewing': 'Under Review',
        'approved': 'Approved',
        'working': 'Work Started',
        'in-progress': 'Work in Progress',
        'fifty-percent': '50% Complete',
        'seventy-percent': '70% Complete',
        'ninety-percent': '90% Complete',
        'testing': 'Testing Phase',
        'completed': 'Completed',
        'delivered': 'Delivered',
        'rejected': 'Rejected'
      };

      await sendEmail({
        to: order.email,
        subject: `📢 Nexora Studio - Project Update: ${order.projectType}`,
        html: `
          <div style="font-family:Arial;padding:20px;background:#0a0a0a;color:#fff;border-radius:10px">
            <h2 style="color:#3b82f6">Project Update</h2>
            <p>Hi ${order.customerName},</p>
            <p>Here's an update on your project: <strong>${order.projectType}</strong></p>
            
            <div style="background:#1a1a1a;padding:15px;border-radius:8px;margin:20px 0">
              <p style="margin:0"><strong>Current Status:</strong> <span style="color:#3b82f6">${statusLabels[status] || status}</span></p>
              <p style="margin:10px 0 0 0"><strong>Progress:</strong> ${order.completionPercentage}%</p>
            </div>
            
            ${adminMessage ? `
              <div style="background:#1a1a1a;padding:15px;border-radius:8px;margin:20px 0;border-left:3px solid #a855f7">
                <p style="margin:0 0 10px 0;color:#a855f7;font-weight:bold">Message from Admin:</p>
                <p style="margin:0">${adminMessage}</p>
              </div>
            ` : ''}
            
            <p>You can track your project progress in your dashboard.</p>
            <p style="color:#a855f7;margin-top:20px">— Nexora Studio Team</p>
          </div>`
      });
    }

    res.json({ success: true, order });
  } catch (error) { next(error); }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check if user owns this order or is admin
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ success: true, order });
  } catch (error) { next(error); }
};