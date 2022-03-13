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

  async findAll(query: QueryParams): Promise<PaginateResult<Post>> {
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
}
