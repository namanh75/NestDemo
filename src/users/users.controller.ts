import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from './dto/users.dto';
import { ResponseDto } from './dto/respone.dto';
import { UsersService } from './users.service';
import { async } from 'rxjs';
import { Param } from '@nestjs/common/decorators';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() user: UserDto): Promise<ResponseDto> {
    const result = await this.usersService.createNewUser(user);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req): Promise<ResponseDto> {
    const result = await this.usersService.getProfile(req.user.username);
    return result;
  }

}
