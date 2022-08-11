import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({
          id: 'abc',
          email,
          password,
        } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of the auth service ', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with the salted and hashed password', async () => {
    const user = await service.signup('asdasd@gasdasd.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user sign up with an email that is already in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: '123', email: 'some@gmas.com', password: 'some' } as User,
      ]);

    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      new BadRequestException('Email already in use'),
    );
  });

  it('throws when sign in its called with an unused email', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('throws an error when an invalid password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: '123', email: 'some@gmas.com', password: 'some' } as User,
      ]);
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      new BadRequestException('Wrong Credentials'),
    );
  });

  it('returns an user when credentials are correct', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: '123',
          email: 'asdf@asdf.com',
          password:
            '89ea1c97ad43fb41.b9bb187d47b828c3445d8ec58e5a08f0f824a9c46b9f458ba02a6e71be7b441b',
        } as User,
      ]);
    const user = await service.signin('asdf@asdf.com', 'asdf');
    expect(user).toBeDefined();
  });
});
