import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@module/user/user.entity'
import { UserService } from '@module/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(payload: User) {
    const user = await this.userService.findOne(payload.id)
    return user
  }
}
