import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ 
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5000'
  ], 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => res.json({ message: 'Nexora Studio API Running 🚀' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));