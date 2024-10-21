import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Min, Max } from 'class-validator';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'integer' })
    estimatedDuration: number; // in minutes

    @Column({ type: 'integer', default: 1 })
    @Min(1)
    @Max(5)
    priority: number; // 1-5, higher number => higher priority

    @Column({ type: 'timestamp', nullable: true })
    deadline?: Date;

    @Column({ length: 50, default: 'default' })
    type: string;

    @Column({ type: 'timestamp', nullable: true })
    startDate?: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate?: Date;

    @Column({ type: 'integer', nullable: true })
    totalSessions?: number;

    @Column({ type: 'integer', nullable: true })
    targetSessionsPerPeriod?: number;

    @Column({ type: 'integer', nullable: true })
    maxSessionsPerPeriod?: number;

    @Column({
        type: 'enum',
        enum: ['day', 'week', 'month', 'year'],
        nullable: true,
    })
    periodUnit?: 'day' | 'week' | 'month' | 'year';

    @Column({ default: false })
    floating: boolean;  // If true, the task can does not get scheduled until the deadline or until it is manually scheduled

    @Column('text', { array: true, default: () => `'{}'` })
    blacklistedDays: string[];

    @Column('text', { array: true, default: () => `'{}'` })
    whitelistedDays: string[];

    @Column({ type: 'integer', default: 0 })
    minDaysBetween: number;

    @Column({ type: 'boolean', default: true })
    autoReschedule: boolean;

    @Column({ type: 'integer', default: 0 })
    completedSessions: number;

    @Column({
        type: 'enum',
        enum: ['one-time', 'recurring', 'floating'],
        default: 'one-time',
    })
    category: 'one-time' | 'recurring' | 'floating';

    @Column({
        type: 'enum',
        enum: ['morning', 'afternoon', 'evening', 'preferred_time'],
        default: 'preferred_time',
    })
    timeOfDayPreference: 'morning' | 'afternoon' | 'evening' | 'preferred_time';

    @Column({ type: 'integer', default: 0 })
    bufferTime: number; // in minutes

    @Column({ type: 'integer', default: 3 })
    @Min(1)
    @Max(5)
    difficulty: number; // scale 1 (easy) to 5 (hard)

    @ManyToMany(() => Task)
    @JoinTable()
    dependencies?: Task[];

    @Column({ type: 'boolean', default: false })
    canSplit: boolean;

    @Column({ type: 'text', nullable: true })
    recurrencePattern?: string; // e.g., 'every 2nd Tuesday of the month'

    @Column({ type: 'time', nullable: true })
    preferredTime?: string; // e.g., '14:00'

    @Column({ length: 7, default: '#A8D8FF' })
    color: string;

    @Column({ type: 'text', nullable: true })
    notes?: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(
        title: string,
        estimatedDuration: number,
        priority: number,
        type: string,
        category: 'one-time' | 'recurring' | 'floating',
        timeOfDayPreference: 'morning' | 'afternoon' | 'evening' | 'preferred_time',
        color: string = '#A8D8FF'
    ) {
        this.title = title;
        this.estimatedDuration = estimatedDuration;
        this.priority = priority;
        this.type = type;
        this.category = category;
        this.timeOfDayPreference = timeOfDayPreference;
        this.color = color;
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.floating = false;
        this.blacklistedDays = [];
        this.whitelistedDays = [];
        this.minDaysBetween = 0;
        this.autoReschedule = true;
        this.completedSessions = 0;
        this.bufferTime = 0;
        this.difficulty = 3;
        this.canSplit = false;
    }
}