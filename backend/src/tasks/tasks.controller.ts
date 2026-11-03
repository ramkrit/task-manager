import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';

@ApiTags('tasks')
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @ApiCreatedResponse({ type: Task })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks (optionally filtered by status)' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiOkResponse({ type: [Task] })
  findAll(@Query('status') status?: TaskStatus): Promise<Task[]> {
    return this.tasksService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by id' })
  @ApiOkResponse({ type: Task })
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiOkResponse({ type: Task })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
