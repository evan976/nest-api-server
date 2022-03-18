import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from '@module/auth/auth.controller'
import { AuthService } from '@module/auth/auth.service'
import { UserModule } from '@module/user/user.module'
import { JwtStrategy } from '@module/auth/jwt.strategy'

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' })

const jwtModule = JwtModule.register({
  secret: 'Nestpress',
  signOptions: { expiresIn: '24h' }
})

@Module({
  imports: [UserModule, passportModule, jwtModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [passportModule, jwtModule]
})
export class AuthModule {}
