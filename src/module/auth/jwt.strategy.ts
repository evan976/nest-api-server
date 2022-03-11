import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from '@module/user/user.entity'
import { AuthService } from '@module/auth/auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'Nestpress',
    })
  }

  async validate(payload: User) {
    const user = await this.authService.validateUser(payload)
    if (!user) {
      throw new UnauthorizedException('身份认证失败')
    }
    return user
  }
}
