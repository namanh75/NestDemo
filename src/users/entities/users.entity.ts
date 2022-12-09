import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'User' })
export class User {
  @PrimaryKey()
  id!: Number;

  @Property()
  username!: String;

  @Property()
  password!: String;

  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}
