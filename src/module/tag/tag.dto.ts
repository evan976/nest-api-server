import { ApiProperty } from '@nestjs/swagger'

export class TagDto {
  @ApiProperty({ description: 'label' })
  readonly label: string

  @ApiProperty({ description: 'value' })
  readonly value: string

  @ApiProperty({ description: '颜色' })
  readonly color: string
}
