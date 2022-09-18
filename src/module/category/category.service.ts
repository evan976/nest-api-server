import { Repository } from 'typeorm'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryEntity } from '@module/category/category.entity'
import { PaginateService } from '@module/paginate/paginate.service'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly paginateService: PaginateService
  ) {}

  async create(category: Partial<CategoryEntity>) {
    const { name, slug } = category

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name })
      .orWhere('category.slug = :slug', { slug })
      .getMany()

    if (categories.length) {
      throw new HttpException(
        `名称 ${name} 或别名 ${slug} 的分类已存在`,
        HttpStatus.BAD_REQUEST
      )
    }

    const model = this.categoryRepository.create(category)
    await this.categoryRepository.save(model)
    return model
  }

  async findAll(query: Record<string, string | number>) {
    const { page = 1, page_size = 12 } = query

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.articles', 'articles')
      .orderBy('category.created_at', 'DESC')

    const result = await this.paginateService.paginate<CategoryEntity>(
      queryBuilder,
      {
        page: +page,
        page_size: +page_size
      }
    )

    result.data.forEach((v) => {
      Object.assign(v, { article_count: v.articles.length })
      delete v.articles
    })

    return result
  }

  async getCount(): Promise<number> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .getCount()
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne(id)
    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
    }
    return category
  }

  async findByCategorySlug(slug: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.slug = :slug', { slug })
      .getOne()

    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
    }
    return category
  }

  async update(id: string, body: Partial<CategoryEntity>) {
    const category = await this.categoryRepository.findOne(id)
    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
    }
    const updatedCategory = this.categoryRepository.merge(category, body)
    return await this.categoryRepository.save(updatedCategory)
  }

  async remove(id: string) {
    try {
      const category = await this.categoryRepository.findOne(id)
      if (!category) {
        throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
      }
      return await this.categoryRepository.remove(category)
    } catch (error) {
      throw new HttpException(
        '删除失败，可能存在关联文章',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async removeMany(ids: Array<string>) {
    try {
      const exist = await this.categoryRepository.findByIds(ids)
      if (!exist.length) {
        throw new HttpException('分类 id 错误', HttpStatus.NOT_FOUND)
      }
      return await this.categoryRepository.remove(exist)
    } catch (error) {
      throw new HttpException(
        '删除失败，可能存在关联文章',
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
