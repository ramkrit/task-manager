import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: MongoRepository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      description: createTaskDto.description ?? '',
      status: createTaskDto.status ?? TaskStatus.TODO,
    });
    return this.taskRepository.save(task);
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    const where = status ? { status } : {};
    return this.taskRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({
      _id: this.toObjectId(id),
    });
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.deleteOne({
      _id: this.toObjectId(id),
    });
    if (!result.deletedCount) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }

  private toObjectId(id: string): ObjectId {
    try {
      return new ObjectId(id);
    } catch {
      throw new NotFoundException(`Invalid task id "${id}"`);
    }
  }
}
