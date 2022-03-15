import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CommentService } from '@module/comment/comment.service'
import { UserService } from '@module/user/user.service'
import { User } from '@module/user/user.entity'
import { QueryParams } from '@interface/pagination.interface'
import { RoleGuard } from '@guard/role.guard'

@ApiTags('评论')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

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

  @ApiOperation({ summary: '获取评论列表' })
  @Get()
  async findAll(@Req() req: Request, @Query() query: QueryParams) {
    if (await this.isAdmin(req)) {
      return this.commentService.findAll(query, true)
    }
    return this.commentService.findAll(query)
  }
}
