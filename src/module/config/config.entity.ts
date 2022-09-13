import { BaseEntity } from '@/utils/entity'
import { Entity, Column } from 'typeorm'

@Entity({ name: 'config' })
export class ConfigEntity extends BaseEntity {
  @Column({ default: null })
  title: string

  @Column({ default: null })
  sub_title: string

  @Column({ type: 'mediumtext', default: null })
  summary: string

  @Column({ type: 'mediumtext', default: null })
  description: string

  @Column({ default: null })
  copyright: string

  @Column({ default: null })
  icp: string

  @Column({ default: null })
  icp_url: string

  @Column({ type: 'simple-array', default: null })
  keywords: Array<string>

  @Column({ default: null })
  logo: string

  @Column({ default: null })
  favicon: string

  @Column({ default: null })
  site_url: string
}
