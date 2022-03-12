import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryController } from '@module/category/category.controller'
import { Category } from '@module/category/category.entity'
import { CategoryService } from '@module/category/category.service'
import { AuthModule } from '@module/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
