import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from 'typeorm'
import { Post } from '@module/post/post.entity'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ default: 'blue' })
  color: string

  @Column({ default: null })
  icon: string

  @Column({ default: null })
  background: string

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Array<Post>

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'created_at'
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'updated_at'
  })
  updatedAt: Date
}
