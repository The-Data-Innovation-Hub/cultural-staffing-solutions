/**
 * Assessment API Server
 *
 * Express server implementing the OpenAPI specification for the
 * Cultural Staffing Solutions Assessment System
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Load environment variables from parent directory (where main .env is located)
dotenv.config({ path: '../.env' });

// Import routes
import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessments';
import learningPathRoutes from './routes/learningPaths';
import courseRoutes from './routes/courses';
import milestoneRoutes from './routes/milestones';
import analyticsRoutes from './routes/analytics';
import waitlistRoutes from './routes/waitlist';
import usersRoutes from './routes/users';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// When running behind a reverse proxy (Render, Vercel, etc.), trust the proxy
// so that secure cookies and protocol detection work correctly.
app.set('trust proxy', 1);

// Database connection pool
// Use SSL for cloud databases (Neon, Render, etc.), disable for local development
const useSSL = process.env.DATABASE_URL?.includes('neon.tech') || 
               process.env.DATABASE_URL?.includes('render.com') ||
               process.env.NODE_ENV === 'production';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false
});

// Test database connection
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Middleware
// Allow multiple frontend origins
const allowedOrigins = [
  'http://localhost:8080',
  'https://www.clinify.agency',
  'https://clinify.agency',
  'https://cultural-staffing-solutions.vercel.app',
  'https://cultural-staffing-solutions-2.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

console.log('✅ JWT-based authentication initialized');

// Health check endpoint - used by monitoring and CI/CD
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    auth: 'JWT'
  });
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Cultural Staffing Solutions - API Docs'
}));

// Swagger JSON spec endpoint
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/waitlist', waitlistRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Assessment API server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
});

export default app;
