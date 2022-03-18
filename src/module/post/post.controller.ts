import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PostService } from '@module/post/post.service'
import { Post as PostEntity } from '@module/post/post.entity'
import { Role, RoleGuard } from '@guard/role.guard'
import { JwtAuthGuard } from '@guard/jwt-auth.guard'
import { QueryParams } from '@interface/app.interface'

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
  async findAll(@Query() query: QueryParams) {
    return this.postService.findAll(query)
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id)
  }

  @ApiOperation({ summary: '根据分类 id 获取文章列表' })
  @Get('category/:id')
  async findByCategoryId(@Param('id') id: string, @Query() query: QueryParams) {
    return this.postService.findByCateId(id, 'category', query)
  }

  @ApiOperation({ summary: '根据标签 id 获取文章列表' })
  @Get('tag/:id')
  async findByTagId(@Param('id') id: string, @Query() query: QueryParams) {
    return this.postService.findByCateId(id, 'tag', query)
  }

  @ApiOperation({ summary: '更新文章' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<PostEntity>) {
    return this.postService.update(id, body)
  }

  @ApiOperation({ summary: '删除文章' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postService.remove(id)
  }

  @ApiOperation({ summary: '批量删除文章' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete()
  removeMany(@Body('ids') ids: string[]) {
    return this.postService.removeMany(ids)
  }

  @ApiOperation({ summary: '更新文章访问数量' })
  @Patch(':id/view')
  async updateViews(@Param('id') id: string) {
    return this.postService.updateViews(id)
  }

  @ApiOperation({ summary: '更新文章喜欢数量' })
  @Patch(':id/like')
  async updateLikes(
    @Param('id') id: string,
    @Body('type') type: 'like' | 'dislike'
  ) {
    return this.postService.updateLikes(id, type)
  }
}
