import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { CORRECT_USER_PASSWORD, mockUser } from './user.mock';

const ACCESS_TOKEN = 'access_token';

class MockUserRepository {
  findOne = jest.fn();
  createUser = jest.fn();
}

class MockJwtService {
  sign = jest.fn(() => ACCESS_TOKEN);
}

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useFactory: () => new MockUserRepository(),
        },
        { provide: JwtService, useFactory: () => new MockJwtService() },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UsersRepository);
  });

  describe('signUp', () => {
    it('calls UsersRepository.createUser and returns the result', async () => {
      userRepository.createUser.mockResolvedValue('some_value');
      const signUpDto: SignUpDto = {
        username: 'random_username',
        password: 'random_password',
      };
      const result = await authService.signUp(signUpDto);
      expect(result).toEqual('some_value');
    });
  });

  describe('signIn', () => {
    it('calls UsersRepository.findOne, compares password, signs JWT and sends accessToken', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const signInDto: SignInDto = {
        username: mockUser.username,
        password: CORRECT_USER_PASSWORD,
      };
      const result = await authService.signIn(signInDto);
      expect(userRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: ACCESS_TOKEN });
    });

    it('calls UsersRepository.findOne and handles user not found error', async () => {
      const signInDto: SignInDto = {
        username: 'wrong_username',
        password: 'any_password',
      };
      await expect(authService.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOne).toHaveBeenCalled();
    });

    it('calls UsersRepository.findOne, compares password, and handles wrong password error', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const signInDto: SignInDto = {
        username: mockUser.username,
        password: 'wrong_password',
      };
      await expect(authService.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });
});
