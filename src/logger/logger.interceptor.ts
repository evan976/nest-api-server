import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  ConsoleLogger
} from '@nestjs/common'
import { tap } from 'rxjs/operators'

export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {
    this.logger.setContext('LoggerInterceptor')
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp()
    const request = http.getRequest()

    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${request.method} ${request.url} ${Date.now() - now}ms`
          )
        )
      )
  }
}
