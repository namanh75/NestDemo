import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  info = {
    name: 'Nam anh',
    age: 22,
  };

  getHello(): any {
    return this.info;
  }
}
