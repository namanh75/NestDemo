import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
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
  async login(@Request() req, @Res({ passthrough: true }) res): Promise<any> {
    const result = await this.authService.login(req.user);
    return result;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Request() req): Promise<ResponseDto> {
    var refresh_token = req.headers.authorization.slice(7);
    const result = await this.authService.logout(refresh_token);
    return result;
  }

  @Get('/refresh-token/:username')
  async refreshToken(
    @Request() req,
    @Param('username') username,
  ): Promise<ResponseDto> {
    var refresh_token = req.headers.authorization.slice(7);
    const result = await this.authService.refreshToken(username, refresh_token);
    return result;
  }
}
