import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@module/auth/auth.module'
import { Wallpaper } from '@module/wallpaper/wallpaper.entity'
import { WallpaperService } from '@module/wallpaper/wallpaper.service'
import { WallpaperController } from '@module/wallpaper/wallpaper.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Wallpaper]), AuthModule],
  controllers: [WallpaperController],
  providers: [WallpaperService],
  exports: [WallpaperService]
})
export class WallpaperModule {}
