import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Config } from '@module/config/config.entity'

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>
  ) {
    const logger = new Logger()
    this.create({ title: 'title' })
      .then(() => logger.log('初始化网站配置创建成功'))
      .catch(() => logger.warn('初始化网站配置已创建'))
  }

  async create(body: Partial<Config>): Promise<Config> {
    const exist = await this.configRepository.findOne({
      where: { title: body.title }
    })
    if (exist) {
      throw new HttpException('配置已存在', HttpStatus.BAD_REQUEST)
    }
    const config = this.configRepository.create(body)
    await this.configRepository.save(config)
    return config
  }

  async find(): Promise<Config> {
    const [config] = await this.configRepository.find()
    return config
  }

  async update(body: Partial<Config>): Promise<Config> {
    const [config] = await this.configRepository.find()
    const model = this.configRepository.merge(config, body)
    return this.configRepository.save(model)
  }
}
