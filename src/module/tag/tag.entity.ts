import { Entity, Column, ManyToMany } from 'typeorm'
import { ArticleEntity } from '@/module/article/article.entity'
import { BaseEntity } from '@/utils/entity'

@Entity({ name: 'tag' })
export class TagEntity extends BaseEntity {
  @Column()
  name: string

  @Column()
  slug: string

  @Column({ default: '#165DFF' })
  color: string

  @Column({ default: null })
  icon: string

  @Column({ default: null })
  background: string

  @ManyToMany(() => ArticleEntity, (article) => article.tags)
  articles: Array<ArticleEntity>
}
