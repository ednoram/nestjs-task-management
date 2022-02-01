import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { mockTask } from './task.mock';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.status.enum';
import { TasksRepository } from './tasks.repository';

import { mockUser } from '../auth/user.mock';

class MockTasksRepository {
  save = jest.fn();
  delete = jest.fn();
  findOne = jest.fn();
  getTasks = jest.fn(() => [mockTask]);
  createTask = jest.fn(() => mockTask);
}

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository: MockTasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: () => new MockTasksRepository(),
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TaskRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(
        tasksService.getTaskById('someId', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('calls TaskRepository.createTask and returns the result', async () => {
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls TaskRepository.delete and deletes task', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1 });
      await tasksService.deleteTask('someId', mockUser);
      expect(tasksRepository.delete).toHaveBeenCalled();
    });

    it('calls TaskRepository.delete and handles an error', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(tasksService.deleteTask('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TaskService.getTaskById, then calls TaskRepository.save and returns the task', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      tasksRepository.save.mockResolvedValue(mockTask);
      const updatedTask = await tasksService.updateTaskStatus(
        'someId',
        { status: TaskStatus.DONE },
        mockUser,
      );
      expect(tasksRepository.findOne).toHaveBeenCalled();
      expect(tasksRepository.save).toHaveBeenCalled();
      expect(updatedTask).toEqual(mockTask);
    });

    it('calls TaskService.getTaskById,then calls TaskRepository.save and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(
        tasksService.updateTaskStatus(
          'someId',
          { status: TaskStatus.DONE },
          mockUser,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(tasksRepository.findOne).toHaveBeenCalled();
    });
  });
});
