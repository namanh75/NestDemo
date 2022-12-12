import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'refreshtoken' })
export class RefreshToken {
  @PrimaryKey()
  username: string;

  @Property()
  refresh_token_name: string;

  @Property()
  refresh_token_expired: Date;

  constructor(
    username: string,
    refresh_token_name: string,
    refresh_token_expired: Date,
  ) {
    this.username = username;
    this.refresh_token_name = refresh_token_name;
    this.refresh_token_expired = refresh_token_expired;
  }
}
