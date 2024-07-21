import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { productCategory } from './product-category.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'ProductCategory', schema: productCategory }])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryModule, ProductCategoryService]
})
export class ProductCategoryModule {}
