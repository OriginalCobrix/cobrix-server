import Order from '../models/Order.js';
import User from '../models/User.js';
import Contact from '../models/Contact.js';

export const getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({ status: { $in: ['approved', 'in-progress'] } });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const pendingPayments = await Order.countDocuments({ paymentStatus: 'unpaid' });
    const receivedPayments = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
    ]);
    const totalUsers = await User.countDocuments();
    const totalContacts = await Contact.countDocuments();

    res.json({
      success: true,
      stats: {
        totalOrders,
        activeOrders,
        completedOrders,
        pendingPayments,
        receivedPayments: receivedPayments[0]?.total || 0,
        totalUsers,
        totalContacts
      }
    });
  } catch (error) { next(error); }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) { next(error); }
};