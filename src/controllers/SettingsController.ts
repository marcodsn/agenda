import { Request, Response } from 'express';
import { AppDataSource } from '../database/dataSource';
import { Setting } from '../entities/Setting';

const settingsRepository = AppDataSource.getRepository(Setting);

export class SettingsController {
    static async getAll(req: Request, res: Response) {
        try {
            const settings = await settingsRepository.find();
            res.json(settings);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching settings', error });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const setting = await settingsRepository.findOne({ where: { key } });
            if (setting) {
                res.json(setting);
            } else {
                res.status(404).json({ message: 'Setting not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching setting', error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { key, value } = req.body;
            const newSetting = settingsRepository.create({ key, value });
            await settingsRepository.save(newSetting);
            res.status(201).json(newSetting);
        } catch (error) {
            res.status(500).json({ message: 'Error creating setting', error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const { value } = req.body;
            const setting = await settingsRepository.findOne({ where: { key } });
            if (setting) {
                setting.value = value;
                await settingsRepository.save(setting);
                res.json(setting);
            } else {
                res.status(404).json({ message: 'Setting not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating setting', error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const result = await settingsRepository.delete({ key });
            if (result.affected && result.affected > 0) {
                res.json({ message: 'Setting deleted successfully' });
            } else {
                res.status(404).json({ message: 'Setting not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting setting', error });
        }
    }
}