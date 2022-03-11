import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Post } from '@module/post/post.entity'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ length: 50 })
  description: string

  @OneToMany(() => Post, (post) => post.category)
  posts: Array<Post>

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
