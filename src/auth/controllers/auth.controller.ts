import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.authService.login(CreateUserDto);
    return user;
  }

  @Post('/register')
  async register(@Body() CreateUserDto: CreateUserDto) {
    const user = await this.authService.register(CreateUserDto);
    return user;
  }
}
