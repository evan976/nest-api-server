import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryController } from '@module/category/category.controller'
import { Category } from '@module/category/category.entity'
import { CategoryService } from '@module/category/category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
