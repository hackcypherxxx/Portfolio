import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import reviewRoutes from './routes/reviewRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import workRoutes from './routes/workRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import cvRoutes from './routes/cvRoutes.js';

dotenv.config();
await connectDB();

const app = express();

// Security & CORS
app.use(helmet());
app.use(cors({
  origin: "https://portfolio-1-frontend-4tz4.onrender.com",
  credentials: true
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/works', workRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/cv', cvRoutes);


// Error handlers 
app.use(notFound);
app.use(errorHandler);

// Launch
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
