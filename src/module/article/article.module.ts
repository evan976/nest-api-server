import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleController } from '@/module/article/article.controller'
import { ArticleEntity } from '@/module/article/article.entity'
import { ArticleService } from '@/module/article/article.service'
import { CategoryModule } from '@module/category/category.module'
import { TagModule } from '@module/tag/tag.module'
import { UserModule } from '@module/user/user.module'
import { AuthModule } from '@module/auth/auth.module'
import { PaginateModule } from '@module/paginate/paginate.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    CategoryModule,
    TagModule,
    UserModule,
    AuthModule,
    PaginateModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService]
})
export class PostModule {}
