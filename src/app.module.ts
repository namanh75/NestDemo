import { logger, MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AutomapperModule } from '@automapper/nestjs';

@Module({
  imports: [
    PostsModule,
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      type: 'mysql',
      dbName: 'demo_nestjs',
      password: '12345678',
      autoLoadEntities: true,
      logger: logger.log.bind(logger),
    }),
    AuthModule,
    UsersModule,
    // AutomapperModule.forRoot({
    //   strategyInitializer: classes(),
    // })
  ],
  controllers: [AppController],
})
export class AppModule {}
