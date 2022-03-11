import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TagService } from '@module/tag/tag.service'
import { TagController } from '@module/tag/tag.controller'
import { Tag } from '@module/tag/tag.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
