export type Token = {
  token: string
}

export interface PaginateResult<T> {
  data: Array<T>
  total: number
  page: number
  pageSize: number
  totalPage: number
}
