import express from 'express';
import { SettingsController } from '../controllers/SettingsController';

const router = express.Router();

router.get('/', SettingsController.getAll);
router.get('/:key', SettingsController.getOne);
router.post('/', SettingsController.create);
router.put('/:key', SettingsController.update);
router.delete('/:key', SettingsController.delete);

export default router;