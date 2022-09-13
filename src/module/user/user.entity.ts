import { Entity, Column, BeforeInsert } from 'typeorm'
import { Exclude } from 'class-transformer'
import * as bcrypt from 'bcryptjs'
import { BaseEntity } from '@/utils/entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  static async comparePassword(password: string, newPassword: string) {
    return bcrypt.compareSync(password, newPassword)
  }

  static encryptPassword(password: string) {
    return bcrypt.hashSync(password, 10)
  }

  @Column({ length: 50 })
  name: string

  @Exclude()
  @Column({ length: 500 })
  password: string

  @Exclude()
  new_password: string

  @Exclude()
  rel_new_password: string

  @Column({ default: null })
  avatar: string

  @Column({ length: 50, default: null })
  email: string

  @Column({ default: null })
  position: string

  @Column({ default: null })
  address: string

  @Column({ default: null })
  site_url: string

  @Column('simple-enum', { enum: ['admin', 'user'], default: 'user' })
  role: string

  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10)
  }
}
