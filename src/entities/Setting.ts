import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  key: string;

  @Column('text')
  value: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(key: string = '', value: string = '') {
    this.key = key;
    this.value = value;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}