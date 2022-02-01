import { User } from './user.entity';

export const mockUser: User = {
  id: 'UserId',
  username: 'SomeUsername',
  password: '$2a$10$jnu9mmD5g/4xwqcHqQjV6uEcs1MOpcxG/tZ/P6/Fdtvn.bU4tC26O', // hashed CORRECT_USER_PASSWORD
  tasks: [],
};

export const CORRECT_USER_PASSWORD = 'correct_password';
