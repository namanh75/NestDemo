import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User, AccessToken } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MikroOrmModule.forFeature([User, AccessToken]),
    JwtModule.register({
      secret: 'secretkey',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
