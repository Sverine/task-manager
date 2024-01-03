import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-tasks-dto';
import { GetTasksFilterdDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskDto } from './dto/update-tasks-dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterdDto): Promise<Task[]> {
    //If we have any filters defined, call taskService.getTasksWithFilters
    //otherwise, just get all tasks
    return this._tasksService.getTasks(filterDto);

    // if (Object.keys(filterDto).length) {
    //   return this._tasksService.getTasksWithFilters(filterDto);
    // } else {
    //   return this._tasksService.getAllTasks();
    // }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this._tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this._tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this._tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskByStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const status = updateTaskDto.status;
    return this._tasksService.updateTaskStatus(id, status);
  }
}
