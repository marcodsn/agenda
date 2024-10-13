import { Request, Response } from 'express';
import { AppDataSource } from '../database/dataSource';
import { Schedule, ScheduleStatus } from '../entities/Schedule';
import { Task } from '../entities/Task';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

const SchedulesRepository: Repository<Schedule> = AppDataSource.getRepository(Schedule);
const TasksRepository: Repository<Task> = AppDataSource.getRepository(Task);

export class SchedulesController {
    static async getAll(req: Request, res: Response) {
        try {
            const schedules = await SchedulesRepository.find();
            res.json(schedules);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching schedules', error });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const schedule = await SchedulesRepository.findOne({ where: { id } });
            if (schedule) {
                res.json(schedule);
            } else {
                res.status(404).json({ message: 'Schedule not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching schedule', error });
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { taskId, startTime, endTime, status, notes } = req.body;
            const task = await TasksRepository.findOne({ where: { id: taskId } });
            if (!task) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            const newSchedule = SchedulesRepository.create({
                task,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status,
                notes
            });
            const result = await SchedulesRepository.save(newSchedule);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating schedule', error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const schedule = await SchedulesRepository.findOne({ where: { id } });
            if (schedule) {
                const updatedSchedule = SchedulesRepository.merge(schedule, req.body);
                const result = await SchedulesRepository.save(updatedSchedule);
                res.json(result);
            } else {
                res.status(404).json({ message: 'Schedule not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating schedule', error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await SchedulesRepository.delete(id);
            if (result.affected && result.affected > 0) {
                res.json({ message: 'Schedule deleted successfully' });
            } else {
                res.status(404).json({ message: 'Schedule not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting schedule', error });
        }
    }

    static async getByDateRange(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const schedules = await SchedulesRepository.find({
                where: {
                    startTime: Between(new Date(startDate as string), new Date(endDate as string))
                },
                order: {
                    startTime: 'ASC'
                }
            });
            res.json(schedules);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching schedules by date range', error });
        }
    }

    static async reschedule(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { newStartTime, newEndTime, notes } = req.body;
            const oldSchedule = await SchedulesRepository.findOne({ where: { id } });
            if (!oldSchedule) {
                res.status(404).json({ message: 'Schedule not found' });
                return;
            }

            // Create new schedule
            const newSchedule = SchedulesRepository.create({
                task: oldSchedule.task,
                startTime: new Date(newStartTime),
                endTime: new Date(newEndTime),
                status: ScheduleStatus.PLANNED,
                notes
            });
            const savedNewSchedule = await SchedulesRepository.save(newSchedule);

            // Update old schedule
            oldSchedule.status = ScheduleStatus.RESCHEDULED;
            oldSchedule.rescheduledTo = savedNewSchedule;
            await SchedulesRepository.save(oldSchedule);

            res.json(savedNewSchedule);
        } catch (error) {
            res.status(500).json({ message: 'Error rescheduling task', error });
        }
    }

    static async completeSchedule(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const schedule = await SchedulesRepository.findOne({ where: { id } });
            if (!schedule) {
                res.status(404).json({ message: 'Schedule not found' });
                return;
            }

            schedule.status = ScheduleStatus.COMPLETED;
            const result = await SchedulesRepository.save(schedule);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error completing schedule', error });
        }
    }
}