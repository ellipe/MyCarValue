import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    const { email, password } = body;
    this.userService.create(email, password);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @UseInterceptors(SerializeInterceptor)
  @Get()
  findAllUsers(@Query('email') email: string) {
    console.log('handler is running...');

    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() attrs: UpdateUserDto) {
    return this.userService.update(id, attrs);
  }
}
