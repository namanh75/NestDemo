import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './entity/accesstoken.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ResponseDto } from 'src/users/dto/respone.dto';
const format = require('date-fns/format');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(AccessToken)
    private accesstokenRepository: EntityRepository<AccessToken>,
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
    const payload = { username: user.username, sub: user.userId };
    var jwt = this.jwtService.sign(payload);

    var datenow = new Date();
    datenow.setDate(datenow.getDate() + 1);
    const token_date = format(datenow, 'yyyy-MM-dd HH:mm:ss');

    var { username, access_token_name, token_expired } = {
      username: user.username,
      access_token_name: jwt,
      token_expired: token_date,
    };

    const data = new AccessToken(username, access_token_name, token_expired);
    await this.accesstokenRepository.persistAndFlush(data);
    
    return new ResponseDto(201, 'Đăng nhập thành công', data);
  }

  async logout(access_token): Promise<ResponseDto> {
    var sqlResultToken = await this.accesstokenRepository.findOne({
      access_token_name: access_token,
    });
    if (!sqlResultToken)
      throw new HttpException(
        'Accesstoken không tồn tại trên hệ thống',
        HttpStatus.BAD_REQUEST,
      );

    var datenow = new Date();
    sqlResultToken.token_expired = datenow;
    await this.accesstokenRepository.persistAndFlush(sqlResultToken);
    return new ResponseDto(
      200,
      'Đã đăng xuất thành công, token không còn được sử dụng được tiếp',
      null,
    );
  }
}
