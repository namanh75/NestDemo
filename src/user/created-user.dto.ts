export class CreateUserDto {
  id: number;
  username: string;
  password: string;
}

export class CreateAccessTokenDto {
  accesstoken: string;
  isdelete: string;
}
