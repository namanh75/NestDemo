import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'User' })
export class User {
  @PrimaryKey()
  id: Number;

  @Property()
  username!: string;

  @Property()
  password!: string;

  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}

@Entity({ tableName: 'AccessToken' })
export class AccessToken {
  @PrimaryKey()
  accesstoken: string;

  @Property()
  isdelete: string;

  constructor(accesstoken: string, isdelete: string) {
    this.accesstoken = accesstoken;
    this.isdelete = isdelete;
  }
}
