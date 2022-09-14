import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@module/auth/auth.module'
import { ConfigService } from '@module/config/config.service'
import { ConfigController } from '@module/config/config.controller'
import { ConfigEntity } from '@module/config/config.entity'
import { ArticleModule } from '@module/article/article.module'
import { CategoryModule } from '@module/category/category.module'
import { TagModule } from '@module/tag/tag.module'
import { CommentModule } from '@module/comment/comment.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfigEntity]),
    ArticleModule,
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
