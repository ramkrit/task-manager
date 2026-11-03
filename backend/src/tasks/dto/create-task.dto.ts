import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Milk, eggs, bread', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
