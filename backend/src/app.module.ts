import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url:
        process.env.MONGODB_URI ??
        'mongodb://localhost:27017/taskmanager',
      database: process.env.MONGODB_DB ?? 'taskmanager',
      entities: [Task],
      synchronize: true,
    }),
    TasksModule,
  ],
})
export class AppModule {}
