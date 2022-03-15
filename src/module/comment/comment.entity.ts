import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
  @Column()
  site: string

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  content: string

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  html: string

  @ApiProperty()
  @Column()
  postId: string

  @ApiProperty()
  @Column()
  url: string

  @ApiProperty()
  @Column({ default: null })
  parentId: string

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  userAgent: string

  @ApiProperty()
  @Column('simple-enum', { enum: CommentState, default: 1 })
  status: number

  @ApiProperty()
  @Column('simple-enum', { enum: Weights, default: 1 })
  weight: number

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'created_at',
  })
  createdAt: Date

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'updated_at',
  })
  updatedAt: Date
}
