import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { CommentState, Weights } from '@/interface/state.interface'

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

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
  @Column({ type: 'mediumtext', default: null })
  html: string

  @ApiProperty()
  @Column({ default: null })
  postId: number

  @ApiProperty()
  @Column({ default: null })
  url: string

  @ApiProperty()
  @Column({ default: null })
  parentId: number

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  userAgent: string

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
  replyUserName: string

  @ApiProperty()
  @Column({ default: null })
  replyUserEmail: string

  @ApiProperty()
  @Column('simple-enum', {
    enum: CommentState,
    default: CommentState.Pass
  })
  status: number

  @ApiProperty()
  @Column('simple-enum', { enum: Weights, default: Weights.Small })
  weight: number

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'created_at'
  })
  createdAt: Date

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'updated_at'
  })
  updatedAt: Date
}
