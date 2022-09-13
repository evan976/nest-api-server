import { Entity, Column, OneToMany } from 'typeorm'
import { ArticleEntity } from '@/module/article/article.entity'
import { BaseEntity } from '@/utils/entity'

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
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

  @OneToMany(() => ArticleEntity, (article) => article.category)
  articles: Array<ArticleEntity>
}
