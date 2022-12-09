import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'AccessToken' })
export class AccessToken {
  @PrimaryKey()
  username: string;

  @Property()
  access_token_name: string;

  @Property()
  token_expired: Date;

  constructor(
    username: string,
    access_token_name: string,
    token_expired: Date,
  ) {
    this.username = username;
    this.access_token_name = access_token_name;
    this.token_expired = token_expired;
  }
}
