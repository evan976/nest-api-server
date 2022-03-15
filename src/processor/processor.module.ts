import { Module, Global } from '@nestjs/common'
import { EmailService } from './email.service'

@Global()
@Module({
  imports: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class ProcessorModule {}
