import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '@module/post/post.entity'
import { PaginateResult } from '@interface/app.interface'
import { TagService } from '@module/tag/tag.service'
import { CategoryService } from '@module/category/category.service'
import { createUUID } from '@/utils/uuid'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService
  ) {}

  async create(body: Partial<Post>): Promise<Post> {
    const { title } = body
    const exist = await this.postRepository.findOne({ where: { title } })
    if (exist) {
      throw new HttpException('文章标题已存在', HttpStatus.BAD_REQUEST)
    }

    const { tags, category } = body

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const existTags = await this.tagService.findByIds(('' + tags).split(','))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const existCategory = await this.categoryService.findOne(category)

    const post = this.postRepository.create({
      ...body,
      category: existCategory,
      tags: existTags,
      articleId: createUUID()()
    })
    return await this.postRepository.save(post)
  }

  async findAll(
    query: Record<string, string | number>
  ): Promise<PaginateResult<Post>> {
    const { page = 1, pageSize = 12, keyword, ...rest } = query
    const [_page, _pageSize] = [page, pageSize].map((v) => Number(v))

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.category', 'category')
      .orderBy('post.createdAt', 'DESC')
      .skip((_page - 1) * _pageSize)
      .take(_pageSize)

    if (keyword) {
      queryBuilder
        .where('post.title LIKE :keyword')
        .orWhere('post.summary LIKE :keyword')
        .orWhere('post.content LIKE :keyword')
        .setParameter('keyword', `%${keyword}%`)
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

  async findOne(id: string): Promise<Post> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.id = :id', { id })

    const post = await queryBuilder.getOne()

    if (!post) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }
    return post
  }

  // 前端获取文章详情
  async findOneByArticleId(articleId: string): Promise<Post> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.articleId = :articleId', { articleId })

    const post = await queryBuilder.getOne()

    if (!post) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }

    // 每次访问文章，访问量+1
    await this.updateViews(post.articleId)
    return post
  }

  async findByCateId(
    id: string,
    type: string,
    query: Record<string, string | number>
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
      .skip((page - 1) * pageSize)
      .take(pageSize)

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
    // eslint-disable-next-line prefer-const
    let { tags, category } = body

    if (tags) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tags = await this.tagService.findByIds(('' + tags).split(','))
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const existCategory = await this.categoryService.findOne(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      category
    )

    const newArticle = {
      ...body,
      views: exist.views,
      category: existCategory
    }

    if (tags) {
      Object.assign(newArticle, { tags })
    }
    const post = this.postRepository.merge(exist, newArticle)
    return await this.postRepository.save(post)
  }

  async remove(id: string): Promise<Post> {
    const exist = await this.postRepository.findOne(id)
    if (!exist) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }
    return await this.postRepository.remove(exist)
  }

  async removeMany(ids: Array<string>): Promise<Post[]> {
    const exist = await this.postRepository.findByIds(ids)
    if (!exist.length) {
      throw new HttpException('文章 id 错误', HttpStatus.NOT_FOUND)
    }
    return await this.postRepository.remove(exist)
  }

  async updateViews(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { articleId: id } })
    const updated = this.postRepository.merge(post, {
      views: post.views + 1
    })
    return this.postRepository.save(updated)
  }

  async updateLikes(id: string, type: 'like' | 'dislike'): Promise<Post> {
    const post = await this.postRepository.findOne(id)
    const updated = this.postRepository.merge(post, {
      likes: type === 'like' ? post.likes + 1 : post.likes - 1
    })
    return this.postRepository.save(updated)
  }

  async updateComments(id: string, type: 'create' | 'remove'): Promise<Post> {
    const post = await this.postRepository.findOne(id)
    const updated = this.postRepository.merge(post, {
      comments: type === 'create' ? post.comments + 1 : post.comments - 1
    })
    return this.postRepository.save(updated)
  }

  async getCount(): Promise<number> {
    return await this.postRepository.createQueryBuilder('post').getCount()
  }
}
