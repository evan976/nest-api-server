import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoryService } from '@module/category/category.service'
import { TagService } from '@module/tag/tag.service'
import { Post } from '@module/post/post.entity'
import { PaginateResult, QueryParams } from '@interface/pagination.interface'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService
  ) {}

  async create(body: Partial<Post>): Promise<Post> {
    const { title } = body
    const exist = await this.postRepository.findOne({ where: { title } })
    if (exist) {
      throw new HttpException('文章标题已存在', HttpStatus.BAD_REQUEST)
    }

    const post = this.postRepository.create(body)
    return await this.postRepository.save(post)
  }

  async findAll(
    query: QueryParams,
    admin = false
  ): Promise<PaginateResult<Post>> {
    const { page = 1, pageSize = 12, keyword, ...rest } = query
    const [_page, _pageSize] = [page, pageSize].map((v) => Number(v))

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.category', 'category')
      .orderBy('post.createdAt', 'DESC')
      .offset((_page - 1) * _pageSize)
      .limit(_pageSize)

    if (keyword) {
      queryBuilder
        .where('post.title LIKE :keyword')
        .orWhere('post.summary LIKE :keyword')
        .orWhere('post.content LIKE :keyword')
        .setParameter('keyword', `%${keyword}%`)
    }

    if (!admin) {
      queryBuilder.andWhere('post.status=1')
    }

    if (rest) {
      Object.keys(rest).forEach((key) => {
        queryBuilder
          .andWhere(`post.${key} LIKE :${key}`)
          .setParameter(`${key}`, `%${rest[key]}%`)
      })
    }

    const [data, total] = await queryBuilder.getManyAndCount()

    data.forEach((d) => {
      delete d.content
    })

    const totalPage = Math.ceil(total / _pageSize) || 1

    return { data, total, page: _page, pageSize: _pageSize, totalPage }
  }

  async findOne(id: string, admin = false): Promise<Post> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('post.id = :id', { id })

    if (!admin) {
      queryBuilder.andWhere('post.status=1')
    }

    const post = await queryBuilder.getOne()

    if (!post) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }

    await this.updateViews(id)
    return post
  }

  async findByCateId(
    id: string,
    type: string,
    query: QueryParams,
    admin = false
  ): Promise<PaginateResult<Post>> {
    const [page, pageSize] = [query.page || 1, query.pageSize || 12].map((v) =>
      Number(v)
    )
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.category', 'category')
      .where(`${type}.id = :id`, { id })
      .orderBy('post.createdAt', 'DESC')
      .offset((page - 1) * pageSize)
      .limit(pageSize)

    if (!admin) {
      queryBuilder.andWhere('post.status=1')
    }

    const [data, total] = await queryBuilder.getManyAndCount()

    data.forEach((d) => {
      delete d.content
    })

    const totalPage = Math.ceil(total / pageSize) || 1

    return { data, total, page, pageSize, totalPage }
  }

  async update(id: string, body: Partial<Post>): Promise<Post> {
    const exist = await this.postRepository.findOne(id)
    if (!exist) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }
    const post = this.postRepository.merge(exist, body)
    return await this.postRepository.save(post)
  }

  async remove(id: string): Promise<Post> {
    const exist = await this.postRepository.findOne(id)
    if (!exist) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }
    return await this.postRepository.remove(exist)
  }

  async updateViews(id: string): Promise<Post> {
    const post = await this.postRepository.findOne(id)
    const updated = this.postRepository.merge(post, {
      views: post.views + 1,
    })
    return this.postRepository.save(updated)
  }

  async updateLikes(id: string, type: 'like' | 'dislike'): Promise<Post> {
    const post = await this.postRepository.findOne(id)
    const updated = this.postRepository.merge(post, {
      likes: type === 'like' ? post.likes + 1 : post.likes - 1,
    })
    return this.postRepository.save(updated)
  }

  async updateComments(id: string): Promise<Post> {
    const post = await this.postRepository.findOne(id)
    const updated = this.postRepository.merge(post, {
      comments: post.comments + 1,
    })
    return this.postRepository.save(updated)
  }
}
