import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { TagDto } from '@module/tag/tag.dto'
import { Tag } from '@module/tag/tag.entity'
import { TagService } from '@module/tag/tag.service'

@ApiTags('标签')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '创建标签' })
  @Post()
  create(@Body() body: TagDto) {
    return this.tagService.create(body)
  }

  @ApiOperation({ summary: '获取标签列表' })
  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll()
  }

  @ApiOperation({ summary: '获取指定标签' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag> {
    return this.tagService.findOne(id)
  }
}
