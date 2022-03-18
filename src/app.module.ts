import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { Tag } from '@module/tag/tag.entity'
import { TagModule } from '@module/tag/tag.module'
import { Post } from '@module/post/post.entity'
import { PostModule } from '@module/post/post.module'
import { parseEnv } from '@/app.env'
import { Category } from '@module/category/category.entity'
import { CategoryModule } from '@module/category/category.module'
import { User } from '@module/user/user.entity'
import { AuthModule } from '@module/auth/auth.module'
import { Comment } from '@module/comment/comment.entity'
import { CommentModule } from '@module/comment/comment.module'
import { ProcessorModule } from '@/processor/processor.module'
import { Config } from '@module/config/config.entity'
import { ConfigModule as OptionModule } from '@module/config/config.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [parseEnv().path]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        entities: [User, Tag, Post, Category, Comment, Config],
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        charset: 'utf8mb4',
        timezone: '+08:00',
        synchronize: true
      })
    }),
    TagModule,
    PostModule,
    CategoryModule,
    CommentModule,
    AuthModule,
    ProcessorModule,
    OptionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
