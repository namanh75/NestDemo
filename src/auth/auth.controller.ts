import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ResponseDto } from 'src/users/dto/respone.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req): Promise<any> {
    const result = await this.authService.login(req.user);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Request() req): Promise<ResponseDto> {
    var access_token = req.headers.authorization.slice(7);
    const result = await this.authService.logout(access_token);
    return result;
  }
}
