import { userEntityMock } from '../../user/__mocks__/user.mock';
import { loginDto } from '../dtos/login.dto';

export const loginUserMock: loginDto = {
  email: userEntityMock.email,
  password: 'payload',
};
