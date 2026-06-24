import Project from '../models/Project.js';
import { sendEmail } from '../utils/sendEmail.js';

// Get all projects (public)
export const getProjects = async (req, res, next) => {
  try {
    const { category, featured, search, founder } = req.query;
    let query = {};

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (founder) {
      // Case-insensitive search for founder name in the founders array
      query.founders = { $regex: founder, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) { 
    next(error); 
  }
};

// Get single project (public)
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) { 
    next(error); 
  }
};

// Get all projects (admin)
export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('addedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) { 
    next(error); 
  }
};

// Create project (admin)
export const createProject = async (req, res, next) => {
  try {
    const projectData = {
      ...req.body,
      addedBy: req.user._id,
      technologies: Array.isArray(req.body.technologies) 
        ? req.body.technologies 
        : req.body.technologies?.split(',').map(t => t.trim()).filter(Boolean),
      features: Array.isArray(req.body.features) 
        ? req.body.features 
        : req.body.features?.split(',').map(f => f.trim()).filter(Boolean),
      keywords: Array.isArray(req.body.keywords) 
        ? req.body.keywords 
        : req.body.keywords?.split(',').map(k => k.trim()).filter(Boolean),
      founders: Array.isArray(req.body.founders) 
        ? req.body.founders 
        : req.body.founders?.split(',').map(f => f.trim()).filter(Boolean)
    };

    const project = await Project.create(projectData);
    
    // Optional: Send notification email
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: '🎉 New Project Added',
      html: `
        <div style="font-family:Arial;padding:20px;background:#0a0a0a;color:#fff">
          <h2 style="color:#3b82f6">New Project Added</h2>
          <p><strong>Title:</strong> ${project.title}</p>
          <p><strong>Category:</strong> ${project.category}</p>
          <p><strong>Added by:</strong> ${req.user.name}</p>
        </div>`
    });

    res.status(201).json({ success: true, project });
  } catch (error) { 
    next(error); 
  }
};

// Update project (admin)
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        technologies: Array.isArray(req.body.technologies) 
          ? req.body.technologies 
          : req.body.technologies?.split(',').map(t => t.trim()).filter(Boolean),
        features: Array.isArray(req.body.features) 
          ? req.body.features 
          : req.body.features?.split(',').map(f => f.trim()).filter(Boolean),
        keywords: Array.isArray(req.body.keywords) 
          ? req.body.keywords 
          : req.body.keywords?.split(',').map(k => k.trim()).filter(Boolean),
        founders: Array.isArray(req.body.founders) 
          ? req.body.founders 
          : req.body.founders?.split(',').map(f => f.trim()).filter(Boolean)
      },
      { new: true, runValidators: true }
    );
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) { 
    next(error); 
  }
};

// Delete project (admin)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) { 
    next(error); 
  }
};

// Toggle featured status (admin)
export const toggleFeatured = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    project.featured = !project.featured;
    await project.save();
    
    res.json({ success: true, project });
  } catch (error) { 
    next(error); 
  }
};