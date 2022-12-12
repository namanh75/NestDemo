import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entity/refreshtoken.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ResponseDto } from 'src/users/dto/respone.dto';
import { jwtConstants } from './constant';
import { User } from 'src/users/entities/users.entity';
const format = require('date-fns/format');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: any): Promise<any> {
    const payload_access = {
      username: user.username,
      id: user.id,
    };
    const payload_refresh = {
      username: user.username,
      key: jwtConstants.secret,
    };
    var jwt_access = this.jwtService.sign(payload_access);
    const jwt_refresh = this.jwtService.sign(payload_refresh);

    var datenow = new Date();
    datenow.setFullYear(datenow.getFullYear() + 1);
    const token_date = format(datenow, 'yyyy-MM-dd HH:mm:ss');

    var { username, refresh_token_name, refresh_token_expired } = {
      username: user.username,
      refresh_token_name: jwt_refresh,
      refresh_token_expired: token_date,
    };

    const data = new RefreshToken(
      username,
      refresh_token_name,
      refresh_token_expired,
    );
    await this.refreshTokenRepository.persistAndFlush(data);
    var res = Object.assign({ access_token_name: jwt_access }, data);
    console.log(res);
    return new ResponseDto(201, 'Đăng nhập thành công', res);
  }

  async logout(refresh_token): Promise<ResponseDto> {
    var sqlResultToken = await this.refreshTokenRepository.findOne({
      refresh_token_name: refresh_token,
    });
    if (!sqlResultToken)
      throw new HttpException(
        'Refresh token không tồn tại, người dùng chưa đăng nhập',
        HttpStatus.BAD_REQUEST,
      );

    var date_now = new Date();
    sqlResultToken.refresh_token_expired = date_now;
    await this.refreshTokenRepository.persistAndFlush(sqlResultToken);
    return new ResponseDto(
      200,
      'Đã đăng xuất thành công, token không còn được sử dụng được tiếp',
      null,
    );
  }

  async refreshToken(user_name, refresh_token_name): Promise<any> {
    var sqlResultToken = await this.refreshTokenRepository.findOne({
      username: user_name,
      refresh_token_name: refresh_token_name
    });
    if (!sqlResultToken) {
      throw new HttpException(
        'Refresh token không tồn tại, vui lòng đăng nhập lại',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (sqlResultToken.refresh_token_expired < new Date()) {
      throw new HttpException(
        'Refresh token đã hết hạn, vui lòng đăng nhập lại',
        HttpStatus.BAD_REQUEST,
      );
    }

    var user = await this.userRepository.findOne({
      username: user_name,
    });
    const payload_access = {
      username: user.username,
      id: user.id,
    };
    const payload_refresh = {
      username: user.username,
      key: jwtConstants.secret,
    };
    var jwt_access = this.jwtService.sign(payload_access);
    var jwt_refresh = this.jwtService.sign(payload_refresh);
    var result ={
      access_token:jwt_access,
      refresh_token:jwt_refresh,
    }

    return new ResponseDto(200, 'Thành công', result);
  }
}
