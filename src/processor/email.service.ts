import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config'
import { ConsoleLogger, Injectable } from '@nestjs/common'
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'

export interface EmailOptions {
  from?: string
  to: string
  subject: string
  text?: string
  html: string
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>
  private clientIsValid: boolean
  private logger: ConsoleLogger

  constructor(private readonly configService: ConfigService) {
    this.logger = new ConsoleLogger()
    this.transporter = nodemailer.createTransport({
      service: 'qq',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('ACCOUNT'),
        pass: this.configService.get('PASSWORD'),
      },
    })
    this.verifyClient()
  }

  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false
        setTimeout(this.verifyClient, 1000 * 60 * 30)
        this.logger.warn('邮件客户端初始化失败，请30分钟后再尝试')
      } else {
        this.clientIsValid = true
        this.logger.log('邮件客户端初始化成功')
      }
    })
  }

  public sendEmail(emailOptions: EmailOptions) {
    if (!this.clientIsValid) {
      this.logger.error('邮件发送成功')
      return false
    }

    let options = {}

    if (emailOptions.from) {
      options = { ...emailOptions }
    } else {
      options = {
        ...emailOptions,
        from: `"evanone.site" <${process.env.EMAIL}>`,
      }
    }

    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        this.logger.error('邮件发送失败', error)
      } else {
        this.logger.log('邮件发送成功', info.messageId, info.response)
      }
    })
  }
}
