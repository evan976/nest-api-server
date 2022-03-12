import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { QueryParams } from '@interface/pagination.interface'
import { CategoryDto } from '@module/category/category.dto'
import { CategoryService } from '@module/category/category.service'
import { JwtAuthGuard } from '@/guard/jwt-auth.guard'
import { Role, RoleGuard } from '@/guard/role.guard'

@ApiTags('分类')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(RoleGuard)
export class CategoryController {
  constructor(private readonly categortService: CategoryService) {}

  @ApiOperation({ summary: '创建分类' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @Role('admin')
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
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  update(@Param('id') id: string, @Body() body: CategoryDto) {
    return this.categortService.update(id, body)
  }

  @ApiOperation({ summary: '根据 id 删除分类' })
  @ApiParam({ name: 'id', required: true, description: '分类 id' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  remove(@Param('id') id: string) {
    return this.categortService.remove(id)
  }
}
