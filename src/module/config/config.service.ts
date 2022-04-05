import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Config } from '@module/config/config.entity'
import { PostService } from '@module/post/post.service'
import { CategoryService } from '@module/category/category.service'
import { TagService } from '@module/tag/tag.service'
import { CommentService } from '@module/comment/comment.service'

export interface SiteData {
  post: number
  category: number
  tag: number
  comment: number
}

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
    private readonly postService: PostService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly commentService: CommentService
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

  async findSiteData(): Promise<SiteData> {
    const post = await this.postService.getCount()
    const category = await this.categoryService.getCount()
    const tag = await this.tagService.getCount()
    const comment = await this.commentService.getCount()

    return {
      post,
      category,
      tag,
      comment
    }
  }

  async update(body: Partial<Config>): Promise<Config> {
    const [config] = await this.configRepository.find()
    const model = this.configRepository.merge(config, body)
    return this.configRepository.save(model)
  }
}
