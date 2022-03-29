import { NestFactory } from '@nestjs/core'
import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import { AppModule } from '@/app.module'
import { HttpExceptionFilter } from '@filter/http-exception.filter'
import { LoggerInterceptor } from '@logger/logger.interceptor'
import { TransformInterceptor } from '@transform/transform.interceptor'

async function bootstrap() {
  const logger = new ConsoleLogger()

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [
        'http://localhost',
        'http://localhost:4000',
        'http://localhost:8080',
        'http://evanone.site',
        'https://evanone.site',
        'http://admin.evanone.site',
        'https://admin.evanone.site',
        'http://static.evanone.site',
        'https://static.evanone.site'
      ],
      credentials: true
    },
    bufferLogs: true,
    logger: logger
  })

  app.use(compression())
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('NestPress')
    .setDescription('RESTful Api server application for my blog')
    .setVersion('2.0.0')
    .addServer('')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(
    new LoggerInterceptor(logger),
    new TransformInterceptor()
  )

  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

  await app.listen(8000)
}
bootstrap()
