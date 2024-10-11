import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import settingsRoutes from './routes/settingsRoutes';
import tasksRoutes from './routes/tasksRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/settings', settingsRoutes);
app.use('/api/tasks', tasksRoutes);

export default app;