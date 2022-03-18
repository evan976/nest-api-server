export type Token = {
  token: string
}

export interface QueryParams {
  [key: string]: string | number
}

export interface PaginateResult<T> {
  data: Array<T>
  total: number
  page: number
  pageSize: number
  totalPage: number
}
