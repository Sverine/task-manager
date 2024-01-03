import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-tasks-dto';
import { GetTasksFilterdDto } from './dto/get-tasks-filter-dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterdDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
  // getTasksWithFilters(filterDto: GetTasksFilterdDto): Task[] | undefined {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task: Task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task: Task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return task;
  //       }
  //     });
  //   }
  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} was not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
