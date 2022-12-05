import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'Post' })
export class Post {
  @PrimaryKey()
  id!: number;

  @Property()
  title: string;

  @Property()
  description: string;

  @Property()
  author: string;

  @Property()
  url: string;

  constructor(id: number, title: string, description: string, author:string, url: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.author = author;
    this.url = url;
  }
}
