import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@module/auth/auth.module'
import { ConfigService } from '@module/config/config.service'
import { ConfigController } from '@module/config/config.controller'
import { ConfigEntity } from '@module/config/config.entity'
import { PostModule } from '../article/article.module'
import { CategoryModule } from '../category/category.module'
import { TagModule } from '../tag/tag.module'
import { CommentModule } from '../comment/comment.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfigEntity]),
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
