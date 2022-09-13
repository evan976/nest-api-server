import { ConsoleLogger } from '@nestjs/common'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message = exception.message ? exception.message : 'Internal Error'

    const logger = new ConsoleLogger()

    response.status(status).json({
      code: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
      result: null
    })
    logger.error(message)
  }
}
