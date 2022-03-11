import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostController } from '@module/post/post.controller'
import { Post } from '@module/post/post.entity'
import { PostService } from '@module/post/post.service'

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
