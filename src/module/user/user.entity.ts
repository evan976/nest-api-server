import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from 'typeorm'
import { Exclude } from 'class-transformer'
import * as bcrypt from 'bcryptjs'

@Entity()
export class User {
  // compare password
  static async comparePassword(password: string, newPassword: string) {
    return bcrypt.compareSync(password, newPassword)
  }

  // encrypt password
  static encryptPassword(password: string) {
    return bcrypt.hashSync(password, 10)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  name: string

  @Exclude()
  @Column({ length: 500 })
  password: string

  @Exclude()
  newPassword: string

  @Exclude()
  relNewPassword: string

  @Column({ length: 50, default: null })
  avatar: string

  @Column({ length: 50, default: null })
  email: string

  @Column('simple-enum', { enum: ['admin', 'user'], default: 'user' })
  role: string

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

  // encrypt the password before inserting data
  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10)
  }
}
