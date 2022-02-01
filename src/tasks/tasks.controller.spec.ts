import { Test } from '@nestjs/testing';

import { mockTask } from './task.mock';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.status.enum';
import { TasksController } from './tasks.controller';

import { mockUser } from '../auth/user.mock';

class MockTasksService {
  deleteTask = jest.fn();
  findOne = jest.fn(() => mockTask);
  getTasks = jest.fn(() => [mockTask]);
  createTask = jest.fn(() => mockTask);
  getTaskById = jest.fn(() => mockTask);
  updateTaskStatus = jest.fn(() => mockTask);
}

describe('TasksController', () => {
  let tasksService: MockTasksService;
  let tasksController: TasksController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksController,
        {
          provide: TasksService,
          useFactory: () => new MockTasksService(),
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksController = module.get(TasksController);
  });

  describe('getTasks', () => {
    it('calls TasksService.getTasks and returns the result', async () => {
      const result = await tasksController.getTasks(mockUser, {});
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksService.getTaskById and returns the result', async () => {
      const result = await tasksController.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('calls TasksService.createTask and returns the result', async () => {
      const result = await tasksController.createTask(mockUser, mockTask);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls TasksService.deleteTask', async () => {
      await tasksController.deleteTask('someId', mockUser);
      expect(tasksService.deleteTask).toHaveBeenCalled();
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TasksService.updateTaskStatus and returns the result', async () => {
      const result = await tasksController.updateTaskStatus(
        mockUser,
        'someId',
        { status: TaskStatus.DONE },
      );
      expect(result).toEqual(mockTask);
    });
  });
});
