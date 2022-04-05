import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@module/auth/auth.module'
import { ConfigService } from '@module/config/config.service'
import { ConfigController } from '@module/config/config.controller'
import { Config } from '@module/config/config.entity'
import { PostModule } from '../post/post.module'
import { CategoryModule } from '../category/category.module'
import { TagModule } from '../tag/tag.module'
import { CommentModule } from '../comment/comment.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Config]),
    PostModule,
    CategoryModule,
    TagModule,
    CommentModule,
    AuthModule
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
