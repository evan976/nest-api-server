import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CategoryDto {
  @ApiProperty({ description: '名称' })
  @IsString({ message: '必须为字符串' })
  readonly name: string

  @ApiProperty({ description: '别名' })
  @IsString({ message: '必须为字符串' })
  readonly slug: string

  @ApiProperty({ description: '描述' })
  @IsString({ message: '必须为字符串' })
  readonly description: string
}
