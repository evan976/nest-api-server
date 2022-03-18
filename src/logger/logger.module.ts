import { Module, ConsoleLogger } from '@nestjs/common'

@Module({
  providers: [ConsoleLogger],
  exports: [ConsoleLogger]
})
export class LoggerModule {}
