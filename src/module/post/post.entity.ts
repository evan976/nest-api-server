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
import { Tag } from '@module/tag/tag.entity'
import { Category } from '@module/category/category.entity'

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ length: 50 })
  title: string

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: Array<Tag>

  @ManyToOne(() => Category, (category) => category.posts, { cascade: true })
  @JoinTable()
  category: Category

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'updated_at',
  })
  updatedAt: Date
}
