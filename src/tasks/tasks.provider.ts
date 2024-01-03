import { DataSource } from 'typeorm';
import { Task } from './task.entity';

export const TasksProvider = [
  {
    provide: 'TASK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
    inject: ['DATA_SOURCE'],
  },
];
