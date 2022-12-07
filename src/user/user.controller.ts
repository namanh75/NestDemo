import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './created-user.dto';
// import { Response } from 'express';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.userService.login(CreateUserDto);
    // res.cookie('jwt', user.access_token, { httpOnly: true });
    return user;
  }

  @Post('/register')
  async register(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.userService.register(CreateUserDto);
    return user;
  }

  @Post('/logout/:accesstoken')
  async logout(@Param("accesstoken") accesstoken: string) {
    const user = await this.userService.logout(accesstoken);
    return user;
  }
}
