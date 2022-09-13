import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { UserEntity } from '@module/user/user.entity'

export const Role = (...role: string[]) => SetMetadata('role', role)

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string[]>('role', context.getHandler())

    if (!role) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    let token = request.headers.authorization as string

    if (/Bearer/.test(token)) {
      token = token.split(' ').pop()
    }

    const user = this.jwtService.decode(token) as UserEntity
    if (!user) {
      return false
    }

    const hasRole = role.some((v) => v === user.role)
    return user && user.role && hasRole
  }
}
