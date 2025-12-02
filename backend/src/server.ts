import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import fixturesRouter from './routes/fixtures';
import vendorsRouter from './routes/vendors';
import manufacturersRouter from './routes/manufacturers';
import distributorsRouter from './routes/distributors';
import searchRouter from './routes/search';
import fixtureCategoriesRouter from './routes/fixtureCategories';
import endorsementIssuesRouter from './routes/endorsement-issues';
import authRouter from './routes/auth';
import vendorInventoryRouter from './routes/vendor-inventory';
import interactiveTrackingRouter from './routes/interactive-tracking';
import similarFixturesRouter from './routes/similar-fixtures';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3002';
console.log('🔒 CORS enabled for:', corsOrigin); // DEBUG LINE
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRouter);
app.use(`/api/${apiVersion}/fixtures`, fixturesRouter);
app.use(`/api/${apiVersion}/fixture-categories`, fixtureCategoriesRouter);
app.use(`/api/${apiVersion}/vendors`, vendorsRouter);
app.use(`/api/${apiVersion}/vendor-inventory`, vendorInventoryRouter);
app.use(`/api/${apiVersion}/manufacturers`, manufacturersRouter);
app.use(`/api/${apiVersion}/distributors`, distributorsRouter);
app.use(`/api/${apiVersion}/search`, searchRouter);
app.use(`/api/${apiVersion}/endorsement-issues`, endorsementIssuesRouter);
app.use(`/api/${apiVersion}/tracking`, interactiveTrackingRouter);
app.use(`/api/${apiVersion}/similar`, similarFixturesRouter);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'RiderReady API',
    version: apiVersion,
    documentation: `/api/${apiVersion}/docs`
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.url} not found`
  });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 RiderReady API server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${port}/api/${apiVersion}`);
});

export default app;
