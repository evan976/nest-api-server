import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from '@module/user/user.entity'
import { UserService } from '@module/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  generateToken(user: Partial<UserEntity>) {
    const assessToken = this.jwtService.sign(user)
    return assessToken
  }

  async validateUser(payload: UserEntity) {
    const user = await this.userService.findOne(String(payload.id))
    return user
  }

  async login(user: Pick<UserEntity, 'name' | 'password'>) {
    const data = await this.userService.login(user)
    const token = this.generateToken({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    })
    return { token }
  }
}
