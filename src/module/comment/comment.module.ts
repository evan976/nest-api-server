import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@module/auth/auth.module'
import { Comment } from '@module/comment/comment.entity'
import { CommentService } from '@module/comment/comment.service'
import { CommentController } from '@module/comment/comment.controller'
import { UserModule } from '@module/user/user.module'
import { PostModule } from '@module/post/post.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UserModule,
    PostModule,
    AuthModule
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService]
})
export class CommentModule {}
