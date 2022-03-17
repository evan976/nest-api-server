import { Module } from '@nestjs/common'
import { AuthModule } from '@module/auth/auth.module'
import { ConfigService } from '@module/config/config.service'
import { ConfigController } from '@module/config/config.controller'

@Module({
  imports: [AuthModule],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
