import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TagService } from '@module/tag/tag.service'
import { TagController } from '@module/tag/tag.controller'
import { Tag } from '@module/tag/tag.entity'
import { AuthModule } from '@module/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AuthModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
