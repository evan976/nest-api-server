import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tag } from '@module/tag/tag.entity'

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async create(tag: Partial<Tag>): Promise<Tag> {
    const { label } = tag
    const exist = await this.tagRepository.findOne({ where: { label } })

    if (exist) {
      throw new HttpException('标签已存在', HttpStatus.BAD_REQUEST)
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
    const tag = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.id=:id')
      .orWhere('tag.label=:id')
      .orWhere('tag.value=:id')
      .setParameter('id', id)
      .getOne()
    if (!tag) {
      throw new HttpException('标签不存在', HttpStatus.NOT_FOUND)
    }
    return tag
  }
}
