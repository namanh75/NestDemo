import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AccessToken } from '../auth/entity/accesstoken.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, AccessToken])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
