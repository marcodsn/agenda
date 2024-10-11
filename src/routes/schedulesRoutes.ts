import express from 'express';
import { SchedulesController } from '../controllers/SchedulesController';

const router = express.Router();

router.get('/', SchedulesController.getAll);
router.get('/:id', SchedulesController.getOne);
router.post('/', SchedulesController.create);
router.put('/:id', SchedulesController.update);
router.delete('/:id', SchedulesController.delete);
router.get('/date-range', SchedulesController.getByDateRange);
router.post('/:id/reschedule', SchedulesController.reschedule);
router.post('/:id/complete', SchedulesController.completeSchedule);

export default router;