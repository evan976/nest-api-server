import {
  Injectable,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    return request
  }

  handleRequest<User>(err: any, user: User): User {
    if (err || !user) {
      throw new UnauthorizedException('身份认证失败', err)
    }
    return user
  }
}
