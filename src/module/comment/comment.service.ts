import * as gravatar from 'gravatar'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { Comment } from '@module/comment/comment.entity'
import { PostService } from '@module/post/post.service'
import { PaginateResult } from '@/interface/app.interface'
import { parseUserAgent } from '@/utils/userAgent'
import { EmailService } from '@/processor/email.service'
import { getNewCommentHtml, getReplyCommentHtml } from '@/utils/html'
import { parseIp } from '@/utils/ip'

@Injectable()
export class CommentService {
  constructor(
    private readonly emailService: EmailService,
    private readonly postService: PostService,
    private readonly configService: ConfigService,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async create(ua: string, ip: string, body: Partial<Comment>): Promise<Comment> {
    const { name, email, content, postId, parentId } = body
    if (!name || !email || !content) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST)
    }

    const { text, data } = parseUserAgent(ua)
    body.userAgent = text
    body.browser = data.browser
    body.os = data.os
    body.ip = ip
    body.address = parseIp(ip)
    body.avatar = gravatar.url(body.email)

    const newComment = this.commentRepository.create(body)
    const post = await this.postService.updateComments(String(postId), 'create')

    if (!body.parentId) {
      this.emailService.sendEmail({
        to: this.configService.get('ACCOUNT'),
        subject: '博客评论通知',
        html: getNewCommentHtml(
          post.title,
          newComment.content,
          newComment.name,
          newComment.site
        )
      })
    } else {
      const comment = await this.findOne(String(parentId))
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

  async findAll(
    query: Record<string, string | number>
  ): Promise<PaginateResult<Comment>> {
    const { page = 1, pageSize = 12, ...rest } = query
    const [_page, _pageSize] = [page, pageSize].map((v) => Number(v))

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .orderBy('comment.createdAt', 'DESC')
      .skip((_page - 1) * _pageSize)
      .take(_pageSize)

    if (rest) {
      Object.keys(rest).forEach((key) => {
        queryBuilder
          .andWhere(`comment.${key} LIKE :${key}`)
          .setParameter(`${key}`, `%${rest[key]}%`)
      })
    }

    const [data, total] = await queryBuilder.getManyAndCount()

    const totalPage = Math.ceil(total / _pageSize) || 1

    return { data, total, page: _page, pageSize: _pageSize, totalPage }
  }

  async findOne(id: string): Promise<Comment> {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id })

    const comment = await queryBuilder.getOne()
    if (!comment) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }

    return comment
  }

  async update(id: string, body: Partial<Comment>): Promise<Comment> {
    const exist = await this.commentRepository.findOne(id)
    if (!exist) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }
    const updatedCategory = this.commentRepository.merge(exist, body)
    return await this.commentRepository.save(updatedCategory)
  }

  async remove(id: string): Promise<Comment> {
    const exist = await this.commentRepository.findOne(id)
    if (!exist) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }
    await this.postService.updateComments(String(exist.postId), 'remove')
    return await this.commentRepository.remove(exist)
  }

  async removeMany(ids: Array<string>): Promise<Comment[]> {
    const exist = await this.commentRepository.findByIds(ids)
    if (!exist.length) {
      throw new HttpException('评论不存在', HttpStatus.NOT_FOUND)
    }
    return await this.commentRepository.remove(exist)
  }

  async getCount(): Promise<number> {
    return await this.commentRepository.createQueryBuilder('comment').getCount()
  }
}
