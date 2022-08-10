import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);
    if (users.length) throw new BadRequestException('Email already in use');
    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const passwordHashed = `${salt}.${hash.toString('hex')}`;

    const user = await this.userService.create(email, passwordHashed);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const [salt, passwordHashed] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== passwordHashed)
      throw new ForbiddenException('Wrong Credentials');
    return user;
  }
}
