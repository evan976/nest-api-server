import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { Role, RoleGuard } from '@/guard/role.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { WallpaperService } from '@module/wallpaper/wallpaper.service'
import { JwtAuthGuard } from '@/guard/jwt-auth.guard'
import { Wallpaper } from './wallpaper.entity'

@Controller('wallpapers')
@ApiTags('壁纸（轮播、广告图）')
@ApiBearerAuth()
@UseGuards(RoleGuard)
export class WallpaperController {
  constructor(private readonly wallpaperService: WallpaperService) {}

  @ApiOperation({ summary: '新增壁纸' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  create(@Body() body: Partial<Wallpaper>) {
    return this.wallpaperService.create(body)
  }

  @ApiOperation({ summary: '获取壁纸列表' })
  @Get()
  findAll(@Query() query: Record<string, string | number>) {
    return this.wallpaperService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定壁纸' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wallpaperService.findOne(id)
  }

  @ApiOperation({ summary: '修改壁纸' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  update(@Param('id') id: string, @Body() body: Partial<Wallpaper>) {
    return this.wallpaperService.update(id, body)
  }

  @ApiOperation({ summary: '删除壁纸' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  remove(@Param('id') id: string) {
    return this.wallpaperService.remove(id)
  }

  @ApiOperation({ summary: '批量删除壁纸' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Delete()
  removeMany(@Body('ids') ids: string[]) {
    return this.wallpaperService.removeMany(ids)
  }
}
