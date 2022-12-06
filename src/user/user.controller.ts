import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './created-user.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.userService.login(CreateUserDto);
    return user;
  }

  @Post('/register')
  async register(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.userService.register(CreateUserDto);
    return user;
  }
}