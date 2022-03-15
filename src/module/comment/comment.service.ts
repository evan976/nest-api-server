import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment } from '@module/comment/comment.entity'
import { PostService } from '@module/post/post.service'
import { PaginateResult, QueryParams } from '@/interface/pagination.interface'
import { parseUserAgent } from '@/utils/userAgent'
import { EmailService } from '@/processor/email.service'
import { getNewCommentHtml, getReplyCommentHtml } from '@/utils/html'

@Injectable()
export class CommentService {
  constructor(
    private readonly emailService: EmailService,
    private readonly postService: PostService,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async create(ua: string, body: Partial<Comment>): Promise<Comment> {
    const { name, email, content, postId } = body
    if (!name || !email || !content) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST)
    }

    const { text } = parseUserAgent(ua)
    body.userAgent = text

    const newComment = this.commentRepository.create(body)
    const post = await this.postService.updateComments(postId)

    if (!body.parentId) {
      this.emailService.sendEmail({
        to: process.env.EMAIL,
        subject: '博客评论通知',
        html: getNewCommentHtml(
          post.title,
          newComment.content,
          newComment.name,
          newComment.site
        ),
      })
    } else {
      const comment = await this.findOne(body.parentId)
      this.emailService.sendEmail({
        to: comment.email,
        subject: '评论回复通知',
        html: getReplyCommentHtml(
          newComment.name,
          comment.content,
          newComment.content,
          newComment.site
        ),
      })
    }

    return await this.commentRepository.save(newComment)
  }

  async findAll(
    query: QueryParams,
    admin = false
  ): Promise<PaginateResult<Comment>> {
    const { page = 1, pageSize = 12, ...rest } = query
    const [_page, _pageSize] = [page, pageSize].map((v) => Number(v))

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .orderBy('comment.createdAt', 'DESC')
      .offset((_page - 1) * _pageSize)
      .limit(_pageSize)

    if (!admin) {
      queryBuilder.andWhere('comment.status=1')
    }

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
    return await this.commentRepository.findOne(id)
  }
}
