import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { TagService } from '@module/tag/tag.service'
import { Tag } from '@module/tag/tag.entity'
import { Role, RoleGuard } from '@guard/role.guard'
import { JwtAuthGuard } from '@guard/jwt-auth.guard'

@ApiTags('标签')
@ApiBearerAuth()
@Controller('tags')
@UseGuards(RoleGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '创建标签' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Post()
  create(@Body() body: Partial<Tag>) {
    return this.tagService.create(body)
  }

  @ApiOperation({ summary: '获取标签列表' })
  @Get()
  findAll() {
    return this.tagService.findAll()
  }

  @ApiOperation({ summary: '获取指定标签' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id)
  }

  @ApiOperation({ summary: '更新标签' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Put(':id')
  update(@Param() id: string, @Body() body: Partial<Tag>) {
    return this.tagService.update(id, body)
  }

  @ApiOperation({ summary: '删除标签' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete(':id')
  remove(@Param() id: string) {
    return this.tagService.remove(id)
  }
}
