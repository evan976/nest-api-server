import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PostService } from '@module/post/post.service'
import { Post as PostEntity } from '@module/post/post.entity'
import { User } from '@module/user/user.entity'
import { UserService } from '@module/user/user.service'
import { Role, RoleGuard } from '@guard/role.guard'
import { JwtAuthGuard } from '@guard/jwt-auth.guard'
import { QueryParams } from '@interface/pagination.interface'

@ApiTags('文章')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({ summary: '新增文章' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  create(@Body() body: Partial<PostEntity>) {
    return this.postService.create(body)
  }

  async isAdmin(req: Request) {
    let token = req.headers.authorization
    if (!token) return false
    if (/Bearer/.test(token)) {
      token = token.split(' ').pop()
    }
    const user = this.jwtService.decode(token) as User
    if (!user) return false

    const exist = await this.userService.findOne(String(user.id))
    if (exist.role !== 'admin') {
      return false
    }
    return true
  }

  @ApiOperation({ summary: '获取文章列表' })
  @Get()
  async findAll(@Req() req: Request, @Query() query: QueryParams) {
    if (await this.isAdmin(req)) {
      return this.postService.findAll(query, true)
    }
    return this.postService.findAll(query)
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    if (await this.isAdmin(req)) {
      return this.postService.findOne(id, true)
    }
    return this.postService.findOne(id)
  }

  @ApiOperation({ summary: '根据分类 id 获取文章列表' })
  @Get('category/:id')
  async findByCategoryId(
    @Req() req: Request,
    @Param('id') id: string,
    @Query() query: QueryParams
  ) {
    if (await this.isAdmin(req)) {
      return this.postService.findByCateId(id, 'category', query, true)
    }
    return this.postService.findByCateId(id, 'category', query)
  }

  @ApiOperation({ summary: '根据标签 id 获取文章列表' })
  @Get('tag/:id')
  async findByTagId(
    @Req() req: Request,
    @Param('id') id: string,
    @Query() query: QueryParams
  ) {
    if (await this.isAdmin(req)) {
      return this.postService.findByCateId(id, 'tag', query, true)
    }
    return this.postService.findByCateId(id, 'tag', query)
  }
}
