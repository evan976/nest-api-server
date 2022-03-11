import { PaginateResult } from '@/interface/pagination.interface'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { QueryParams } from '@interface/pagination.interface'
import { Category } from '@module/category/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>
  ) {}

  async create(category: Partial<Category>): Promise<Category> {
    const { slug, name } = category

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

  async findAll(query: QueryParams): Promise<PaginateResult<Category>> {
    const [page, pageSize] = [query.page || 1, query.pageSize || 12].map((v) =>
      Number(v)
    )

    const [data, total] = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'posts')
      .orderBy('category.createdAt', 'DESC')
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .getManyAndCount()

    const totalPage = Math.ceil(total / pageSize) || 1

    data.forEach((v) => {
      Object.assign(v, { postCount: v.posts.length })
      delete v.posts
    })

    return { data, total, page, pageSize, totalPage }
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne(id)
    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
    }
    return category
  }

  async update(id: string, body: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.findOne(id)
    if (!category) {
      throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
    }
    const updatedCategory = this.categoryRepository.merge(category, body)
    return this.categoryRepository.save(updatedCategory)
  }

  async remove(id: string): Promise<boolean> {
    try {
      const category = await this.categoryRepository.findOne(id)
      if (!category) {
        throw new HttpException('分类不存在', HttpStatus.NOT_FOUND)
      }
      await this.categoryRepository.remove(category)
      return true
    } catch (error) {
      throw new HttpException(
        '删除失败，可能存在关联文章',
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
