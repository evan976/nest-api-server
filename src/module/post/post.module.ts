import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostController } from '@module/post/post.controller'
import { Post } from '@module/post/post.entity'
import { PostService } from '@module/post/post.service'
import { CategoryModule } from '@module/category/category.module'
import { TagModule } from '@module/tag/tag.module'
import { UserModule } from '@module/user/user.module'
import { AuthModule } from '@module/auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    CategoryModule,
    TagModule,
    UserModule,
    AuthModule
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
