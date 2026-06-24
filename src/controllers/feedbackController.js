import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ success: true, feedback });
  } catch (error) { next(error); }
};

export const getApprovedFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) { next(error); }
};

export const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) { next(error); }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, feedback });
  } catch (error) { next(error); }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) { next(error); }
};