import { Entity, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { CommentState } from '@/interface/state.interface'
import { BaseEntity } from '@/utils/entity'

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string

  @ApiProperty()
  @Column()
  email: string

  @ApiProperty()
  @Column({ default: null })
  avatar: string

  @ApiProperty()
  @Column({ default: null })
  site: string

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  content: string

  @ApiProperty()
  @Column({ default: null })
  article_id: number

  @ApiProperty()
  @Column({ default: null })
  parent_id: number

  @ApiProperty()
  @Column({ default: null })
  browser: string

  @ApiProperty()
  @Column({ default: null })
  os: string

  @ApiProperty()
  @Column({ default: null })
  ip: string

  @ApiProperty()
  @Column({ default: null })
  address: string

  @ApiProperty()
  @Column({ default: null })
  reply_user_name: string

  @ApiProperty()
  @Column({ default: null })
  reply_user_email: string

  @ApiProperty()
  @Column({ default: null })
  reply_user_site: string

  @ApiProperty()
  @Column('simple-enum', {
    enum: CommentState,
    default: CommentState.Review
  })
  status: number
}
