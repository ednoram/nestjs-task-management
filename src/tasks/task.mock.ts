import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';

import { mockUser } from '../auth/user.mock';

export const mockTask: Task = {
  id: 'TaskId',
  title: 'Task title',
  description: 'Task description',
  status: TaskStatus.OPEN,
  user: mockUser,
};
