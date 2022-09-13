import * as gravatar from 'gravatar'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { CommentEntity } from '@module/comment/comment.entity'
import { ArticleService } from '@/module/article/article.service'
import { parseUserAgent } from '@/utils/userAgent'
import { EmailService } from '@/processor/email.service'
import { getNewCommentHtml, getReplyCommentHtml } from '@/utils/html'
import { parseIp } from '@/utils/ip'
import { ArticleEntity } from '../article/article.entity'

@Injectable()
export class CommentService {
  constructor(
    private readonly emailService: EmailService,
    private readonly articleService: ArticleService,
    private readonly configService: ConfigService,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async create(ua: string, ip: string, body: Partial<CommentEntity>) {
    const { name, email, content, article_id, parent_id } = body
    if (!name || !email || !content) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST)
    }

    const { data } = parseUserAgent(ua)
    body.browser = data.browser
    body.os = data.os
    body.ip = ip

    if (!body.avatar) {
      body.avatar = gravatar.url(body.email)
    }

    const address = parseIp(ip)

    if (address) {
      body.address = address || '未知'
    }

    const newComment = this.commentRepository.create(body)

    let post: ArticleEntity

    if (article_id) {
      post = await this.articleService.updateComments(
        String(article_id),
        'create'
      )
    }

    if (!body.parent_id) {
      this.emailService.sendEmail({
        to: this.configService.get('ACCOUNT'),
        subject: '博客评论通知',
        html: getNewCommentHtml(
          post?.title || '',
          newComment.content,
          newComment.name,
          newComment.site
        )
      })
    } else {
      const comment = await this.findOne(String(parent_id))
      this.emailService.sendEmail({
        to: comment.email,
        subject: '评论回复通知',
        html: getReplyCommentHtml(
          newComment.name,
          comment.content,
          newComment.content,
          newComment.site
        )
      })
    }

    return await this.commentRepository.save(newComment)
  }

  async findAll(params: Record<string, string | number>) {
    const { page = 1, page_size = 12, status, ...rest } = params

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.parent_id is NULL')
      .orderBy('comment.created_at', 'DESC')

    const subQuery = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.parent_id=:parent_id')

    queryBuilder.skip((+page - 1) * +page_size)
    queryBuilder.take(+page_size)

    if (status) {
      queryBuilder.andWhere('comment.status = :status', { status })
      subQuery.andWhere('comment.status = :status', { status })
    }

    if (rest) {
      Object.keys(rest).forEach((key) => {
        queryBuilder
          .andWhere(`comment.${key} LIKE :${key}`)
          .setParameter(`${key}`, `%${rest[key]}%`)
      })
    }

    const [data, total] = await queryBuilder.getManyAndCount()

    for (const item of data) {
      const subComments = await subQuery
        .setParameter('parent_id', item.id)
        .getMany()
      Object.assign(item, { replys: subComments })
    }

    const total_page = Math.ceil(total / +page_size) || 1

    return { data, total, page, page_size, total_page }
  }

  async findOne(id: string) {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id })

    const comment = await queryBuilder.getOne()
    if (!comment) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }

    return comment
  }

  async update(id: string, body: Partial<CommentEntity>) {
    const exist = await this.commentRepository.findOne(id)
    if (!exist) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }
    const updatedCategory = this.commentRepository.merge(exist, body)
    return await this.commentRepository.save(updatedCategory)
  }

  async remove(id: string) {
    const exist = await this.commentRepository.findOne(id)
    if (!exist) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }
    if (exist.article_id) {
      await this.articleService.updateComments(
        String(exist.article_id),
        'remove'
      )
    }
    return await this.commentRepository.remove(exist)
  }

  async removeMany(ids: Array<string>) {
    const exist = await this.commentRepository.findByIds(ids)
    if (!exist.length) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }
    return await this.commentRepository.remove(exist)
  }

  async getCount() {
    return await this.commentRepository.createQueryBuilder('comment').getCount()
  }
}
