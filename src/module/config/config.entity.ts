import {
  Entity,
  Column,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: null })
  title: string

  @Column({ default: null })
  subTitle: string

  @Column({ type: 'mediumtext', default: null })
  summary: string

  @Column({ default: null })
  copyright: string

  @Column({ default: null })
  icp: string

  @Column({ default: null })
  icpUrl: string

  @Column({ type: 'simple-array', default: null })
  keywords: Array<string>

  @Column({ default: null })
  logo: string

  @Column({ default: null })
  favicon: string

  @Column({ default: null })
  siteUrl: string

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date
}
