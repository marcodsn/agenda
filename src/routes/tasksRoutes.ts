import express from 'express';
import { TasksController } from '../controllers/TasksController';

const router = express.Router();

router.get('/', TasksController.getAll);
router.get('/:id', TasksController.getOne);
router.post('/', TasksController.create);
router.put('/:id', TasksController.update);
router.delete('/:id', TasksController.delete);
router.get('/date-range', TasksController.getByDateRange);
router.get('/overdue', TasksController.getOverdue);
router.patch('/:id/completed-sessions', TasksController.updateCompletedSessions);

export default router;