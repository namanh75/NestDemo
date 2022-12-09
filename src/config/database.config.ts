import { logger, MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export const dbConfig: MikroOrmModuleOptions = {
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  type: 'mysql',
  dbName: 'demo_nestjs',
  password: '12345678',
  autoLoadEntities: true,
  logger: logger.log.bind(logger),
};
