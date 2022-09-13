import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TagEntity } from '@module/tag/tag.entity'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async create(tag: Partial<TagEntity>): Promise<TagEntity> {
    const { name, slug } = tag

    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.name = :name', { name })
      .orWhere('tag.slug = :slug', { slug })
      .getMany()

    if (tags.length) {
      throw new HttpException(
        `名称 ${name} 或别名 ${slug} 的标签已存在`,
        HttpStatus.BAD_REQUEST
      )
    }

    const data = this.tagRepository.create(tag)
    await this.tagRepository.save(data)
    return data
  }

  async findAll() {
    const data = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.articles', 'articles')
      .orderBy('tag.created_at', 'DESC')
      .getMany()

    data.forEach((t) => {
      Object.assign(t, { article_count: t.articles.length })
      delete t.articles
    })

    return data
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOne(id)
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.NOT_FOUND)
    }
    return tag
  }

  async findBySlug(slug: string) {
    const tag = await this.tagRepository.findOne({ slug })
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.NOT_FOUND)
    }
    return tag
  }

  async findByIds(ids: string[]) {
    return this.tagRepository.findByIds(ids)
  }

  async update(id: string, body: Partial<TagEntity>) {
    const tag = await this.tagRepository.findOne(id)
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.NOT_FOUND)
    }
    const updatedTag = this.tagRepository.merge(tag, body)
    return await this.tagRepository.save(updatedTag)
  }

  async remove(id: string) {
    try {
      const tag = await this.tagRepository.findOne(id)
      if (!tag) {
        throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
      }
      return await this.tagRepository.remove(tag)
    } catch (error) {
      throw new HttpException(
        '删除失败，可能存在关联文章',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async removeMany(ids: Array<string>) {
    try {
      const exist = await this.tagRepository.findByIds(ids)
      if (!exist.length) {
        throw new HttpException('标签 id 错误', HttpStatus.NOT_FOUND)
      }
      return await this.tagRepository.remove(exist)
    } catch (error) {
      throw new HttpException(
        '删除失败，可能存在关联文章',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async getCount(): Promise<number> {
    return this.tagRepository.createQueryBuilder('tag').getCount()
  }
}
