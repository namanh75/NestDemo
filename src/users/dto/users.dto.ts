import { IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  id: number;

  @IsNotEmpty({ message: 'username is not empty' })
  @Length(5, 255)
  username: string;

  @IsNotEmpty({ message: 'password is not empty' })
  @Length(5, 255)
  password: string;

  refreshToken: string;
}
