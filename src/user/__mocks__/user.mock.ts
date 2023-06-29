import { UserEntity } from '../entity/user.entity';

export const userEntityMock: UserEntity = {
  cpf: '123453543',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'emailmock@email.com',
  id: 8930,
  name: 'nameMock',
  password: 'largePassword',
};
