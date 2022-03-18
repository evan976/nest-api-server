import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@module/auth/auth.module'
import { ConfigService } from '@module/config/config.service'
import { ConfigController } from '@module/config/config.controller'
import { Config } from '@module/config/config.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Config]), AuthModule],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
