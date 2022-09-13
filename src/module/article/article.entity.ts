import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { TagEntity } from '@module/tag/tag.entity'
import { CategoryEntity } from '@module/category/category.entity'
import { OriginState, PublishState } from '@interface/state.interface'
import { BaseEntity } from '@/utils/entity'

@Entity({ name: 'article' })
export class ArticleEntity extends BaseEntity {
  @ApiProperty()
  @Column({ default: null })
  article_id: string

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
  @ManyToMany(() => TagEntity, (tag) => tag.articles, { cascade: true })
  @JoinTable()
  tags: Array<TagEntity>

  @ApiProperty()
  @ManyToOne(() => CategoryEntity, (category) => category.articles, {
    cascade: true
  })
  @JoinTable()
  category: CategoryEntity

  @ApiProperty()
  @Column('simple-enum', { enum: PublishState, default: 1 })
  status: number

  @ApiProperty()
  @Column('simple-enum', { enum: OriginState, default: 0 })
  origin: number

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  likes: number

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  comments: number
}
