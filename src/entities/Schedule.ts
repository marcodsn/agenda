import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from './Task';

export enum ScheduleStatus {
    PLANNED = 'planned',
    COMPLETED = 'completed',
    RESCHEDULED = 'rescheduled'
}

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Task, { eager: true })
    @JoinColumn()
    task: Task;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({
        type: 'enum',
        enum: ScheduleStatus,
        default: ScheduleStatus.PLANNED
    })
    status: ScheduleStatus;

    @OneToOne(() => Schedule, { nullable: true })
    @JoinColumn()
    rescheduledTo?: Schedule | null;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor(
        task: Task,
        startTime: Date,
        endTime: Date,
        status: ScheduleStatus = ScheduleStatus.PLANNED,
        notes: string | null = null
    ) {
        this.task = task;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.notes = notes;
    }
}