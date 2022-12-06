import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './created-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    private jwtService: JwtService
  ) {}

  /**
   * Xử lý đăng nhập
   */
  async login(user: CreateUserDto): Promise<any> {
    console.log(user);
    if (!user.username || !user.password) {
      throw new HttpException(
        'Tên đăng nhập hoặc mật khẩu không được để trống',
        HttpStatus.BAD_REQUEST,
      );
    }
    const sqlResult = await this.userRepository.findOne({
      username: user.username,
      password: user.password,
    });
    console.log(sqlResult);
    if (!sqlResult) {
      throw new HttpException(
        'tên đăng nhập hoặc mật khẩu sai',
        HttpStatus.BAD_REQUEST,
      );
    }
    const jwt =await this.jwtService.sign({id:user.id})
    return {
      message: 'đăng nhập thành công',
      access_token: jwt,
      redirect_URL: "/"
    };
  }

  /**
   * Xử lý đăng ký
   */
  async register(user: CreateUserDto): Promise<any> {
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

    const { id, username, password } = user;
    const data = new User(id, username, password);
    await this.userRepository.persistAndFlush(data);
    return {
      message: 'Đăng ký thành công, vui lòng đăng nhập',
      data: data,
    };
  }
}
