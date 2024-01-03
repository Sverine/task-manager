import { Controller } from '@nestjs/common';
import {
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common/decorators';
import { CreateTaskDto } from './dto/create-tasks-dto';
import { GetTasksFilterdDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskDto } from './dto/update-tasks-dto';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterdDto): Task[] {
    //If we have any filters defined, call taskService.getTasksWithFilters
    //otherwise, just get all tasks

    if (Object.keys(filterDto).length) {
      return this._tasksService.getTasksWithFilters(filterDto);
    } else {
      return this._tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this._tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this._tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this._tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskByStatus(
    @Param('id') id: string,
    @Body('status') updateTaskDto: UpdateTaskDto,
  ): Task {
    const status = updateTaskDto.status;
    return this._tasksService.updateTaskStatus(id, status);
  }
}
