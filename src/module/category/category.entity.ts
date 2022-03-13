import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Post } from '@module/post/post.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ default: null })
  description: string

  @Column({ default: null })
  icon: string

  @Column({ default: null })
  background: string

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
