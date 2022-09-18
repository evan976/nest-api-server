import { Injectable } from '@nestjs/common'
import { Repository, SelectQueryBuilder } from 'typeorm'

export interface PaginateQuery {
  page: number
  page_size?: number
}

export interface PaginateResponse<T> {
  data: Array<T>
  page: number
  total: number
  page_size: number
  total_page: number
}

@Injectable()
export class PaginateService {
  private _total: number
  private _query: PaginateQuery

  public async paginate<T>(
    repository: SelectQueryBuilder<T> | Repository<T>,
    query: PaginateQuery
  ): Promise<PaginateResponse<T>> {
    let data = []
    let total = 0

    this._query = query

    if (repository instanceof SelectQueryBuilder) {
      ;[data, total] = await this.paginateQueryBuilder<T>(repository)
    } else {
      ;[data, total] = await this.paginateRepository(repository)
    }

    this._total = total

    return {
      data,
      ...this.pagination
    }
  }

  private async paginateQueryBuilder<T>(qb: SelectQueryBuilder<T>) {
    return qb.skip(this.skip).take(this._query.page_size).getManyAndCount()
  }

  private async paginateRepository<T>(repo: Repository<T>) {
    return repo.findAndCount({
      skip: this.skip,
      take: this._query.page_size
    })
  }

  private get skip() {
    if (this._query.page < 1) {
      return 0
    }

    return (this._query.page - 1) * this._query.page_size
  }

  private get totalPage() {
    return Math.ceil(this._total / this._query.page_size)
  }

  private get pagination() {
    return {
      page: +this._query.page || 1,
      page_size: +this._query.page_size,
      total: +this._total,
      total_page: +this.totalPage
    }
  }
}
