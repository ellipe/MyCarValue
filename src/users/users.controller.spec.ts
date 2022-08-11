import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  const fakeUser = ({
    id = Math.floor(Math.random() * 99999).toString(),
    email = 'some@mail.com',
    password = 'somepassword',
  }) =>
    ({
      id,
      email,
      password,
    } as User);

  beforeEach(async () => {
    fakeUserService = {
      find: (email: string) => Promise.resolve([fakeUser({ email })]),
      findOne: (id: string) => Promise.resolve(fakeUser({ id })),
      remove: (id: string) => Promise.resolve(fakeUser({ id })),
      update: (id: string, attrs: Partial<User>) =>
        Promise.resolve(fakeUser({ id })),
    };

    fakeAuthService = {
      signup: (email: string, password: string) => Promise.resolve(null),
      signin: (email: string, password: string) =>
        Promise.resolve(fakeUser({ email, password })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers - returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('some@mail.com');
    expect(users).toBeDefined();
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('some@mail.com');
  });

  it('findUser - return a user with the given id', async () => {
    const user = await controller.findUser('someid');
    expect(user).toBeDefined();
    expect(user.id).toEqual('someid');
  });

  it('findUser - return NotFoundException when user not found', async () => {
    fakeUserService.findOne = () => Promise.resolve(null);

    await expect(controller.findUser('someid')).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('SignIn - update session object and returns an user', async () => {
    const session: any = {};
    const user = await controller.signin(
      { email: 'some@mail.com', password: 'somepassword' },
      session,
    );

    expect(user).toBeDefined();
    expect(user.email).toEqual('some@mail.com');
    expect(session.userId).toEqual(user.id);
  });
});
