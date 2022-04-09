import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Wallpaper } from '@module/wallpaper/wallpaper.entity'
import { PaginateResult } from '@/interface/app.interface'

@Injectable()
export class WallpaperService {
  constructor(
    @InjectRepository(Wallpaper)
    private readonly wallpaperRepository: Repository<Wallpaper>
  ) {}

  async create(wallpaper: Partial<Wallpaper>): Promise<Wallpaper> {
    const { name, url } = wallpaper

    const wallpapers = await this.wallpaperRepository
      .createQueryBuilder('wallpaper')
      .where('wallpaper.name = :name', { name })
      .orWhere('wallpaper.url = :url', { url })
      .getMany()

    if (wallpapers.length) {
      throw new HttpException('资源已存在', HttpStatus.BAD_REQUEST)
    }

    const model = this.wallpaperRepository.create(wallpaper)
    await this.wallpaperRepository.save(model)
    return model
  }

  async findAll(
    query: Record<string, string | number>
  ): Promise<PaginateResult<Wallpaper>> {
    const [page, pageSize] = [query.page || 1, query.pageSize || 12].map((v) =>
      Number(v)
    )

    const [data, total] = await this.wallpaperRepository
      .createQueryBuilder('wallpaper')
      .orderBy('wallpaper.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    const totalPage = Math.ceil(total / pageSize) || 1

    return { data, total, page, pageSize, totalPage }
  }

  async findOne(id: string): Promise<Wallpaper> {
    const wallpaper = await this.wallpaperRepository.findOne(id)
    if (!wallpaper) {
      throw new HttpException('资源不存在', HttpStatus.NOT_FOUND)
    }
    return wallpaper
  }

  async update(id: string, wallpaper: Partial<Wallpaper>): Promise<Wallpaper> {
    const data = await this.wallpaperRepository.findOne(id)
    if (!data) {
      throw new HttpException('资源不存在', HttpStatus.NOT_FOUND)
    }
    const updatedWallpaper = this.wallpaperRepository.merge(data, wallpaper)
    return await this.wallpaperRepository.save(updatedWallpaper)
  }

  async remove(id: string): Promise<Wallpaper> {
    const wallpaper = await this.wallpaperRepository.findOne(id)
    if (!wallpaper) {
      throw new HttpException('资源不存在', HttpStatus.NOT_FOUND)
    }
    return await this.wallpaperRepository.remove(wallpaper)
  }

  async removeMany(ids: Array<string>): Promise<Wallpaper[]> {
    const exist = await this.wallpaperRepository.findByIds(ids)
    if (!exist.length) {
      throw new HttpException('资源不存在', HttpStatus.NOT_FOUND)
    }
    return await this.wallpaperRepository.remove(exist)
  }
}
