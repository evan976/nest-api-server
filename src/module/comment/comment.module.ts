import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@module/auth/auth.module'
import { CommentEntity } from '@module/comment/comment.entity'
import { CommentService } from '@module/comment/comment.service'
import { CommentController } from '@module/comment/comment.controller'
import { UserModule } from '@module/user/user.module'
import { ArticleModule } from '@module/article/article.module'
import { PaginateModule } from '@module/paginate/paginate.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    UserModule,
    ArticleModule,
    AuthModule,
    PaginateModule
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService]
})
export class CommentModule {}
