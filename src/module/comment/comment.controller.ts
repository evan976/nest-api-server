import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CommentService } from '@module/comment/comment.service'
import { CommentEntity } from '@module/comment/comment.entity'
import { Role, RoleGuard } from '@guard/role.guard'
import { JwtAuthGuard } from '@/guard/jwt-auth.guard'
import { getClientIP } from '@/utils/ip'
import type { Request } from 'express'

@ApiTags('评论')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '新增评论' })
  @Post()
  async create(@Req() req: Request, @Body() body: Partial<CommentEntity>) {
    const userAgent = req.headers['user-agent']
    const ip = getClientIP(req)
    return this.commentService.create(userAgent, ip, body)
  }

  @ApiOperation({ summary: '获取评论列表' })
  @Get()
  async findAll(@Query() query: Record<string, string | number>) {
    return this.commentService.findAll(query)
  }

  @ApiOperation({ summary: '获取文章评论列表' })
  @Get('article/:id')
  async findAllByArticleId(
    @Param('id') id: string,
    @Query() query: Record<string, number>
  ) {
    return this.commentService.findAllByArticleId(id, query)
  }

  @ApiOperation({ summary: '获取指定评论' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id)
  }

  @ApiOperation({ summary: '更新评论' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<CommentEntity>) {
    console.log(id, body)
    return this.commentService.update(id, body)
  }

  @ApiOperation({ summary: '删除评论' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id)
  }

  @ApiOperation({ summary: '批量删除评论' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete()
  removeMany(@Body('ids') ids: string[]) {
    return this.commentService.removeMany(ids)
  }
}
