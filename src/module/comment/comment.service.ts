import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment } from '@module/comment/comment.entity'
import { PaginateResult, QueryParams } from '@/interface/pagination.interface'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async findAll(
    query: QueryParams,
    admin = false
  ): Promise<PaginateResult<Comment>> {
    const { page = 1, pageSize = 12, ...rest } = query
    const [_page, _pageSize] = [page, pageSize].map((v) => Number(v))

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .orderBy('comment.createdAt', 'DESC')
      .offset((_page - 1) * _pageSize)
      .limit(_pageSize)

    if (!admin) {
      queryBuilder.andWhere('comment.status=1')
    }

    if (rest) {
      Object.keys(rest).forEach((key) => {
        queryBuilder
          .andWhere(`comment.${key} LIKE :${key}`)
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
