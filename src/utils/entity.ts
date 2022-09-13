import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Type } from 'class-transformer'

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int',
    width: 11,
    nullable: false,
    readonly: true,
    default: () => 0
  })
  @Type(() => Number)
  created_at: number

  @Column({
    type: 'int',
    width: 11,
    nullable: true,
    default: () => null
  })
  @Type(() => Number)
  updated_at?: number

  @BeforeInsert()
  updateDateCreation() {
    this.created_at = Math.round(new Date().getTime() / 1000)
  }

  @BeforeUpdate()
  updateDateUpdate() {
    this.updated_at = Math.round(new Date().getTime() / 1000)
  }
}
