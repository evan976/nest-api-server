import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs/operators'

export interface Response<T> {
  result: T
}

export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((result) => ({
        code: 0,
        message: 'success',
        result
      }))
    )
  }
}
