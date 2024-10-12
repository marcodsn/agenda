import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authMiddleware from './middleware/authMiddleware';
import settingsRoutes from './routes/settingsRoutes';
import tasksRoutes from './routes/tasksRoutes';
import schedulesRoutes from './routes/schedulesRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/api/settings', settingsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/schedules', schedulesRoutes);

export default app;