import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { OnlineState, Weights } from '@/interface/state.interface'

@Entity()
export class Wallpaper {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: null })
  name: string

  @Column({ default: null })
  description: string

  @Column()
  url: string

  @Column()
  link: string

  @Column('simple-enum', { enum: OnlineState, default: 1 })
  status: number

  @Column('simple-enum', { enum: Weights, default: 1 })
  weight: number

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at'
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at'
  })
  updatedAt: Date
}
