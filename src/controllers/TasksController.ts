import { Request, Response } from 'express';
import { AppDataSource } from '../database/dataSource';
import { Task } from '../entities/Task';
import { Between, IsNull, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export class TasksController {
    private static repository = AppDataSource.getRepository(Task);

    static async getAll(req: Request, res: Response) {
        try {
            const tasks = await this.repository.find();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tasks', error });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const task = await this.repository.findOne({ where: { id } });
            if (task) {
                res.json(task);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching task', error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const newTask = this.repository.create(req.body);
            const result = await this.repository.save(newTask);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating task', error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const task = await this.repository.findOne({ where: { id } });
            if (task) {
                const updatedTask = this.repository.merge(task, req.body);
                const result = await this.repository.save(updatedTask);
                res.json(result);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating task', error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.repository.delete(id);
            if (result.affected && result.affected > 0) {
                res.json({ message: 'Task deleted successfully' });
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting task', error });
        }
    }

    static async getByDateRange(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;
            const tasks = await this.repository.find({
                where: {
                    startDate: Between(new Date(startDate as string), new Date(endDate as string))
                }
            });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tasks by date range', error });
        }
    }

    static async getOverdue(req: Request, res: Response) {
        try {
            const tasks = await this.repository.find({
                where: {
                    deadline: LessThanOrEqual(new Date()),
                    endDate: IsNull()
                }
            });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching overdue tasks', error });
        }
    }

    static async updateCompletedSessions(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { completedSessions } = req.body;
            const task = await this.repository.findOne({ where: { id } });
            if (task) {
                task.completedSessions = completedSessions;
                const result = await this.repository.save(task);
                res.json(result);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating completed sessions', error });
        }
    }
}