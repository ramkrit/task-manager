import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @ObjectIdColumn()
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: ObjectId;

  @Column()
  @ApiProperty({ example: 'Buy groceries' })
  title: string;

  @Column({ default: '' })
  @ApiProperty({ example: 'Milk, eggs, bread', required: false })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  status: TaskStatus;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
