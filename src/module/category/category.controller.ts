import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { QueryParams } from '@interface/pagination.interface'
import { CategoryDto } from '@module/category/category.dto'
import { CategoryService } from '@module/category/category.service'

@ApiTags('分类')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categortService: CategoryService) {}

  @ApiOperation({ summary: '创建分类' })
  @Post()
  create(@Body() body: CategoryDto) {
    return this.categortService.create(body)
  }

  @ApiOperation({ summary: '获取分类列表' })
  @ApiQuery({ name: 'page', required: false, description: '页数' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页显示条数' })
  @Get()
  findAll(@Query() query: QueryParams) {
    return this.categortService.findAll(query)
  }

  @ApiOperation({ summary: '根据 id 获取分类' })
  @ApiParam({ name: 'id', required: true, description: '分类 id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categortService.findOne(id)
  }

  @ApiOperation({ summary: '根据 id 更新分类' })
  @ApiParam({ name: 'id', required: true, description: '分类 id' })
  @Put(':id')
  update(@Param('id') id: string, @Body() body: CategoryDto) {
    return this.categortService.update(id, body)
  }

  @ApiOperation({ summary: '根据 id 删除分类' })
  @ApiParam({ name: 'id', required: true, description: '分类 id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categortService.remove(id)
  }
}
