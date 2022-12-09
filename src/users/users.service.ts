import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccessToken } from '../auth/entity/accesstoken.entity';
import { UserDto } from './dto/users.dto';
import { ResponseDto } from './dto/respone.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(AccessToken)
    private accessTokenRepository: EntityRepository<AccessToken>,
  ) {}

  async findOne(username: string): Promise<any> {
    var sqlResult = await this.userRepository.findOne({
      username: username,
    });
    return sqlResult;
  }

  async createNewUser(user: UserDto): Promise<any> {
    if (!user.username || !user.password) {
      throw new HttpException(
        'Tên đăng nhập hoặc mật khẩu không được để trống',
        HttpStatus.BAD_REQUEST,
      );
    }

    var sqlResult = await this.userRepository.findOne({
      username: user.username,
    });
    if (sqlResult)
      throw new HttpException(
        'Tên đăng nhập đã tồn tại trên hệ thống',
        HttpStatus.BAD_REQUEST,
      );

    const saltOrRounds = 10;
    var password_hash = user.password;
    user.password = await bcrypt.hash(password_hash, saltOrRounds);

    const { id, username, password } = user;
    const data = new User(id, username, password);
    await this.userRepository.persistAndFlush(data);
    return new ResponseDto(201, 'Đăng ký thành công', data);
  }

  async getProfile(username: string): Promise<ResponseDto> {
    var sqlResultToken = await this.accessTokenRepository.findOne({
      username: username,
    });
    if (!sqlResultToken) {
      throw new HttpException('Token không tồn tại', HttpStatus.BAD_REQUEST);
    }
    if (sqlResultToken.token_expired < new Date()) {
      throw new HttpException(
        'Token đã hết hạn, vui lòng đăng nhập lại',
        HttpStatus.BAD_REQUEST,
      );
    }

    var sqlResult = await this.userRepository.findOne({
      username: username,
    });
    const { password, ...result } = sqlResult;
    return new ResponseDto(200, 'Thành công', result);
  }
}
