import { logger, MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    PostsModule,
    AuthModule,
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: 'demo_nestjs',
      type: 'mysql',
      password:'12345678',
      autoLoadEntities: true,
      logger: logger.log.bind(logger),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
