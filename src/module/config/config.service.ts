import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigEntity } from '@module/config/config.entity'
import { ArticleService } from '@/module/article/article.service'
import { CategoryService } from '@module/category/category.service'
import { TagService } from '@module/tag/tag.service'
import { CommentService } from '@module/comment/comment.service'

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>,
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly commentService: CommentService
  ) {
    const logger = new Logger()
    this.create({ title: '默认标题' })
      .then(() => logger.log('初始化网站配置创建成功'))
      .catch(() => logger.warn('初始化网站配置已创建'))
  }

  async create(body: Partial<ConfigEntity>) {
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

  async find() {
    const [config] = await this.configRepository.find()
    return config
  }

  async findSiteData() {
    const article = await this.articleService.getCount()
    const category = await this.categoryService.getCount()
    const tag = await this.tagService.getCount()
    const comment = await this.commentService.getCount()

    return {
      article,
      category,
      tag,
      comment
    }
  }

  async update(body: Partial<ConfigEntity>) {
    const [config] = await this.configRepository.find()
    const model = this.configRepository.merge(config, body)
    return this.configRepository.save(model)
  }
}
