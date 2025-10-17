import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import meRouter from './routes/me';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // Trust first proxy for rate limiting

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
});

app.use(limiter);
app.use(express.json());

// CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(meRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'My HNG Stage 0 API is running!',
    endpoints: {
      profile: '/me',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test the endpoint at: http://localhost:${PORT}/me`);
});
