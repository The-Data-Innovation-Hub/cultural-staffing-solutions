/**
 * Assessment API Server
 *
 * Express server implementing the OpenAPI specification for the
 * Cultural Staffing Solutions Assessment System
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessments';
import learningPathRoutes from './routes/learningPaths';
import courseRoutes from './routes/courses';
import milestoneRoutes from './routes/milestones';
import analyticsRoutes from './routes/analytics';
import waitlistRoutes from './routes/waitlist';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// When running behind a reverse proxy (Render, Vercel, etc.), trust the proxy
// so that secure cookies and protocol detection work correctly.
app.set('trust proxy', 1);

// Database connection pool
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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

// Create PostgreSQL session store
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool: db,
  tableName: 'session', // Table will be auto-created
  createTableIfMissing: true,
  errorLog: (error) => {
    console.error('❌ Session store error:', error);
  }
});

// Log session store events
sessionStore.on('error', (error) => {
  console.error('❌ Session store error event:', error);
});

console.log('✅ PostgreSQL session store initialized');

// Session middleware
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true, // Force session to be saved back to store
  saveUninitialized: true, // Save new sessions even if not modified
  // Required when behind a proxy to correctly set secure cookies using X-Forwarded-Proto
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Optional: Mock authentication middleware for non-auth routes (development only)
// TEMPORARY: Enabled for testing analytics endpoints
app.use((req, res, next) => {
  if (!req.session.userId && !req.path.startsWith('/api/auth') && process.env.NODE_ENV === 'development') {
    req.session.userId = '0d21d737-353f-4b6d-b0a9-93cccb43730f';
  }
  next();
});

// Health check endpoint - used by monitoring and CI/CD
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint to check current session
app.get('/api/debug/session', (req, res) => {
  res.json({
    userId: req.session.userId,
    sessionID: req.sessionID
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
