import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tag } from '@module/tag/tag.entity'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>
  ) {}

  async create(tag: Partial<Tag>): Promise<Tag> {
    const { label, value } = tag

    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.label = :label', { label })
      .orWhere('tag.value = :value', { value })
      .getMany()

    if (tags.length) {
      throw new HttpException(
        `名称 ${label} 或别名 ${value} 的标签已存在`,
        HttpStatus.BAD_REQUEST
      )
    }

    const model = this.tagRepository.create(tag)
    await this.tagRepository.save(model)
    return model
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .orderBy('tag.createdAt', 'DESC')
      .leftJoinAndSelect('tag.posts', 'posts')
      .getMany()

    tags.forEach((t) => {
      Object.assign(t, { postCount: t.posts.length })
      delete t.posts
    })

    return tags
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne(id)
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.NOT_FOUND)
    }
    return tag
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    return this.tagRepository.findByIds(ids)
  }

  async update(id: string, body: Partial<Tag>): Promise<Tag> {
    const tag = await this.tagRepository.findOne(id)
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.NOT_FOUND)
    }
    const updatedTag = this.tagRepository.merge(tag, body)
    return await this.tagRepository.save(updatedTag)
  }

  async remove(id: string): Promise<Tag> {
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

  async removeMany(ids: Array<string>): Promise<Tag[]> {
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
}
