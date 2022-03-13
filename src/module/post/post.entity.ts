import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Tag } from '@module/tag/tag.entity'
import { Category } from '@module/category/category.entity'
import { OriginState, PublishState, Weights } from '@interface/state.interface'

@Entity()
export class Post {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column()
  title: string

  @ApiProperty()
  @Column({ default: null })
  thumb: string

  @ApiProperty()
  @Column({ type: 'text', default: null })
  summary: string

  @ApiProperty()
  @Column({ type: 'mediumtext', default: null })
  content: string

  @ApiProperty()
  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: Array<Tag>

  @ApiProperty()
  @ManyToOne(() => Category, (category) => category.posts, { cascade: true })
  @JoinTable()
  category: Category

  @ApiProperty()
  @Column('simple-enum', { enum: PublishState, default: 1 })
  status: number

  @ApiProperty()
  @Column('simple-enum', { enum: OriginState, default: 0 })
  origin: number

  @ApiProperty()
  @Column('simple-enum', { enum: Weights, default: 1 })
  weight: number

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  likes: number

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
