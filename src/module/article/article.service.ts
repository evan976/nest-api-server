import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleEntity } from '@/module/article/article.entity'
import { TagService } from '@module/tag/tag.service'
import { CategoryService } from '@module/category/category.service'
import { PaginateService } from '@module/paginate/paginate.service'
import { createUUID } from '@/utils/uuid'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly paginateService: PaginateService
  ) {}

  async create(body: Partial<ArticleEntity>) {
    const { title } = body
    const exist = await this.articleRepository.findOne({ where: { title } })
    if (exist) {
      throw new HttpException('文章标题已存在', HttpStatus.BAD_REQUEST)
    }

    const { tags, category } = body

    const existTags = await this.tagService.findByIds(('' + tags).split(','))

    const existCategory = await this.categoryService.findOne(
      category as unknown as string
    )

    const post = this.articleRepository.create({
      ...body,
      category: existCategory,
      tags: existTags,
      article_id: createUUID()()
    })
    return await this.articleRepository.save(post)
  }

  async findAll(query: Record<string, string | number>) {
    const {
      page = 1,
      page_size = 12,
      keyword,
      start_time,
      end_time,
      ...rest
    } = query

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.category', 'category')
      .orderBy('article.created_at', 'DESC')

    if (keyword) {
      queryBuilder
        .where('article.title LIKE :keyword')
        .orWhere('article.summary LIKE :keyword')
        .orWhere('article.content LIKE :keyword')
        .setParameter('keyword', `%${keyword}%`)
    }

    if (start_time && end_time) {
      queryBuilder.andWhere('article.created_at BETWEEN :start AND :end', {
        start: +start_time,
        end: +end_time
      })
    }

    if (rest) {
      Object.keys(rest).forEach((key) => {
        queryBuilder
          .andWhere(`article.${key} LIKE :${key}`)
          .setParameter(`${key}`, `%${rest[key]}%`)
      })
    }

    const result = await this.paginateService.paginate(queryBuilder, {
      page: +page,
      page_size: +page_size
    })

    result.data.forEach((d) => {
      delete d.content
    })

    return result
  }

  async findByCategorySlug(slug: string, params: Record<string, number>) {
    const { page = 1, page_size = 12 } = params

    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .where('category.slug = :slug', { slug })
      .orderBy('article.created_at', 'DESC')

    const result = await this.paginateService.paginate(query, {
      page: +page,
      page_size: +page_size
    })

    result.data.forEach((d) => {
      delete d.content
    })

    return result
  }

  async findByTagSlug(slug: string, params: Record<string, number>) {
    const { page = 1, page_size = 12 } = params

    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .where('tag.slug = :slug', { slug })
      .orderBy('article.created_at', 'DESC')

    const result = await this.paginateService.paginate(query, {
      page: +page,
      page_size: +page_size
    })

    result.data.forEach((d) => {
      delete d.content
    })

    return result
  }

  async findHotArticleList() {
    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .orderBy('article.views', 'DESC')
      .limit(10)
      .getMany()

    articles.forEach((article) => {
      delete article.content
    })

    return articles
  }

  async findOne(id: string) {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.id = :id', { id })

    const article = await queryBuilder.getOne()

    if (!article) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }
    return article
  }

  // 前端获取文章详情
  async findOneByArticleId(articleId: string) {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.article_id = :article_id', { article_id: articleId })

    const article = await queryBuilder.getOne()

    if (!article) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }

    // 每次访问文章，访问量+1
    await this.updateViews(article.article_id)
    return article
  }

  async update(id: string, body: Partial<ArticleEntity>) {
    const exist = await this.articleRepository.findOne(id)
    if (!exist) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }
    let { tags, category } = body

    if (tags) {
      tags = await this.tagService.findByIds(('' + tags).split(','))
    }

    const existCategory = await this.categoryService.findOne(
      category as unknown as string
    )

    const newArticle = {
      ...body,
      views: exist.views,
      category: existCategory
    }

    if (tags) {
      Object.assign(newArticle, { tags })
    }
    const article = this.articleRepository.merge(exist, newArticle)
    return await this.articleRepository.save(article)
  }

  async remove(id: string) {
    const exist = await this.articleRepository.findOne(id)
    if (!exist) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND)
    }
    return await this.articleRepository.remove(exist)
  }

  async removeMany(ids: Array<string>) {
    const exist = await this.articleRepository.findByIds(ids)
    if (!exist.length) {
      throw new HttpException('文章 id 错误', HttpStatus.NOT_FOUND)
    }
    return await this.articleRepository.remove(exist)
  }

  async updateViews(id: string) {
    const article = await this.articleRepository.findOne({
      where: { article_id: id }
    })
    const updated = this.articleRepository.merge(article, {
      views: article.views + 1
    })
    await this.articleRepository.save(updated)
  }

  async updateLikes(id: string, type: 'like' | 'dislike') {
    const article = await this.articleRepository.findOne(id)
    const updated = this.articleRepository.merge(article, {
      likes: type === 'like' ? article.likes + 1 : article.likes - 1
    })
    return this.articleRepository.save(updated)
  }

  async updateComments(id: string, type: 'create' | 'remove') {
    const article = await this.articleRepository.findOne(id)
    const updated = this.articleRepository.merge(article, {
      comments: type === 'create' ? article.comments + 1 : article.comments - 1
    })
    return this.articleRepository.save(updated)
  }

  async getCount(): Promise<number> {
    return await this.articleRepository.createQueryBuilder('post').getCount()
  }
}
