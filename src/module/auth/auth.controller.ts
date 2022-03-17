import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { AuthService } from '@module/auth/auth.service'
import { User } from '@module/user/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  async login(@Body() body: Partial<User>) {
    return await this.authService.login(body)
  }
}
