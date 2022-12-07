import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, CreateAccessTokenDto } from './created-user.dto';
import { User, AccessToken } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(AccessToken)
    private accesstokenRepository: EntityRepository<AccessToken>,
    private jwtService: JwtService,
  ) {}

  /**
   * Xử lý đăng nhập
   */
  async login(user: CreateUserDto): Promise<any> {
    //validate username hoặc password của người dùng gửi lên không được phép để trống
    if (!user.username || !user.password) {
      throw new HttpException(
        'Tên đăng nhập hoặc mật khẩu không được để trống',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Tìm trong csdl thông tin của người dùng đó
    var sqlResult = await this.userRepository.findOne({
      username: user.username,
      password: user.password,
    });

    //Trả về thông báo sai nếu thông tin tài khoản không hợp lệ
    if (!sqlResult) {
      throw new HttpException(
        'Tên đăng nhập hoặc mật khẩu sai',
        HttpStatus.BAD_REQUEST,
      );
    }
    //thực hiện mã hóa id người dùng
    const jwt = await this.jwtService.sign({ id: user.id });

    //lưu token thu được vào trong DB
    var { accesstoken, isdelete } = { accesstoken: jwt, isdelete: 'false' };
    const data = new AccessToken(accesstoken, isdelete);
    await this.accesstokenRepository.persistAndFlush(
      new AccessToken(jwt, 'false'),
    );

    return {
      message: 'Xác thực tài khoản thành công',
      access_token: jwt,
    };
  }

  /**
   * Xử lý đăng ký
   */
  async register(user: CreateUserDto): Promise<any> {
    //validate username hoặc password của người dùng gửi lên không được phép để trống
    if (!user.username || !user.password) {
      throw new HttpException(
        'Tên đăng nhập hoặc mật khẩu không được để trống',
        HttpStatus.BAD_REQUEST,
      );
    }

    //thực hiện truy vấn để kiểm tra tên người dùng đã được sử dụng hay chưa
    var sqlResult = await this.userRepository.findOne({
      username: user.username,
    });
    if (sqlResult)
      throw new HttpException(
        'Tên đăng nhập đã tồn tại trên hệ thống',
        HttpStatus.BAD_REQUEST,
      );

    //nếu dữ liệu hợp lệ có thể lưu thông tin người dùng
    const { id, username, password } = user;
    const data = new User(id, username, password);
    await this.userRepository.persistAndFlush(data);
    return {
      message: 'Đăng ký thành công, vui lòng đăng nhập',
      data: data,
    };
  }
  /**
   * Xử lý đăng xuất
   */
  async logout(accesstoken: string): Promise<any> {
    
    // thực hiện truy vấn kiểm tra token đã có trên hệ thông hay chưa
    var sqlResultToken = await this.accesstokenRepository.findOne({
      accesstoken: accesstoken,
    });
    if (!sqlResultToken)
      throw new HttpException(
        'Chưa đăng nhập, accesstoken không tồn tại trên hệ thống',
        HttpStatus.BAD_REQUEST,
      );

    //thực hiện xóa mềm token
    sqlResultToken.isdelete = 'true';
    await this.accesstokenRepository.persistAndFlush(sqlResultToken);
    return {
      message:
        'Đã đăng xuất thành công, token không còn được sử dụng được tiếp',
    };
  }
}
