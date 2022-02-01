import { Test } from '@nestjs/testing';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CORRECT_USER_PASSWORD, mockUser } from './user.mock';

const ACCESS_TOKEN = 'access_token';

class MockAuthService {
  signUp = jest.fn();
  signIn = jest.fn(() => ({ accessToken: ACCESS_TOKEN }));
}

describe('AuthController', () => {
  let authService: MockAuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useFactory: () => new MockAuthService(),
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    authController = module.get(AuthController);
  });

  describe('signUp', () => {
    it('calls AuthService.signIn and returns the result', async () => {
      const signInDto: SignInDto = {
        username: mockUser.username,
        password: CORRECT_USER_PASSWORD,
      };
      const result = await authController.signIn(signInDto);
      expect(result).toEqual({ accessToken: ACCESS_TOKEN });
    });
  });

  describe('signIn', () => {
    it('calls AuthService.signUp and returns the result', async () => {
      const signUpDto: SignUpDto = {
        username: 'any_username',
        password: 'any_password',
      };
      authService.signUp.mockResolvedValue('mock_value');
      const result = await authController.signUp(signUpDto);
      expect(result).toEqual('mock_value');
    });
  });
});
