import { Module } from '@nestjs/common';
import { ProductPackingSizesService } from './product-packing-sizes.service';
import { ProductPackingSizesController } from './product-packing-sizes.controller';
import { productPackingSizes } from './product-packing-sizes.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ProductPackingSizes', schema: productPackingSizes }])],
  providers: [ProductPackingSizesService],
  controllers: [ProductPackingSizesController],
  exports: [ProductPackingSizesModule, ProductPackingSizesService]
})
export class ProductPackingSizesModule {}
