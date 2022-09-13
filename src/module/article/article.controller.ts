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
import { ArticleService } from '@/module/article/article.service'
import { ArticleEntity } from '@/module/article/article.entity'
import { Role, RoleGuard } from '@guard/role.guard'
import { JwtAuthGuard } from '@guard/jwt-auth.guard'

@ApiTags('文章')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '新增文章' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  create(@Body() body: Partial<ArticleEntity>) {
    return this.articleService.create(body)
  }

  @ApiOperation({ summary: '获取文章列表' })
  @Get()
  async findAll(@Query() query: Record<string, string | number>) {
    return this.articleService.findAll(query)
  }

  @ApiOperation({ summary: '获取热门文章列表' })
  @Get('hot')
  async findHotArticleList() {
    return this.articleService.findHotArticleList()
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (id.length >= 18) {
      return this.articleService.findOneByArticleId(id)
    }
    return this.articleService.findOne(id)
  }

  @ApiOperation({ summary: '前台获取文章详情' })
  @Get('detail/:id')
  async findArticleDetail(@Param('id') id: string) {
    return this.articleService.findOneByArticleId(id)
  }

  @ApiOperation({ summary: '根据分类别名获取文章列表' })
  @Get('category/slug/:slug')
  async findByCategorySlug(
    @Param('slug') slug: string,
    @Query() query: Record<string, number>
  ) {
    return this.articleService.findByCategorySlug(slug, query)
  }

  @ApiOperation({ summary: '根据标签别名获取文章列表' })
  @Get('tag/slug/:slug')
  async findByTagSlug(
    @Param('slug') slug: string,
    @Query() query: Record<string, number>
  ) {
    return this.articleService.findByTagSlug(slug, query)
  }

  @ApiOperation({ summary: '更新文章' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<ArticleEntity>) {
    return this.articleService.update(id, body)
  }

  @ApiOperation({ summary: '删除文章' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articleService.remove(id)
  }

  @ApiOperation({ summary: '批量删除文章' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete()
  removeMany(@Body('ids') ids: string[]) {
    return this.articleService.removeMany(ids)
  }

  @ApiOperation({ summary: '更新文章访问数量' })
  @Patch(':id/view')
  async updateViews(@Param('id') id: string) {
    return this.articleService.updateViews(id)
  }

  @ApiOperation({ summary: '更新文章喜欢数量' })
  @Patch(':id/like')
  async updateLikes(
    @Param('id') id: string,
    @Body('type') type: 'like' | 'dislike'
  ) {
    return this.articleService.updateLikes(id, type)
  }
}
