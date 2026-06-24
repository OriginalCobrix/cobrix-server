import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  tag: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  
  // URLs
  liveUrl: { type: String },
  githubUrl: { type: String },
  
  // Images
  mainImage: { type: String, required: true },
  gallery: [String],
  
  // Tech & Features
  technologies: [String],
  features: [String],
  
  // Stats
  stats: {
    users: String,
    uptime: String,
    rating: Number,
    completedDate: String
  },
  
  // Metadata
  category: { 
    type: String, 
    enum: ['SaaS', 'Web', 'Mobile', 'AI', 'E-commerce', 'Healthcare', 'Other'],
    default: 'Web'
  },
  featured: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['completed', 'ongoing', 'maintenance'],
    default: 'completed'
  },
  
  // SEO
  keywords: [String],
  
  // Created by
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  founders: [{ type: String }] // Names of founders who worked on it
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);