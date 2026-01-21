import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import { config } from './config/config';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running successfully');
});

// Routes will be added here
import userRoutes from './routes/userRoutes';
app.use('/api/users', userRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
