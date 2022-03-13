import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PostService } from '@module/post/post.service'
import { Role, RoleGuard } from '@guard/role.guard'
import { JwtAuthGuard } from '@guard/jwt-auth.guard'
import { Post as PostEntity } from '@module/post/post.entity'
import { QueryParams } from '@interface/pagination.interface'

@ApiTags('文章')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '新增文章' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  create(@Body() body: Partial<PostEntity>) {
    return this.postService.create(body)
  }

  @ApiOperation({ summary: '获取文章列表' })
  @Get()
  findAll(@Query() query: QueryParams) {
    return this.postService.findAll(query)
  }
}
