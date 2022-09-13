import { Module } from '@nestjs/common'
import { PaginateService } from './paginate.service'

@Module({
  providers: [PaginateService],
  exports: [PaginateService]
})
export class PaginateModule {}
