import { Module } from '@nestjs/common';
import { LotDataService } from './lot-data.service';
import { LotDataController } from './lot-data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogModule } from '../catalog/catalog.module';
import { lotDataSchema } from '../lot-data/lot-data.schema';
import { ProfileModule } from '../profile/profile.module';
import { UserModule } from '../users/user.module';
import { ProductPackingSizesModule } from '../product-packing-sizes/product-packing-sizes.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'LotData', schema: lotDataSchema }]), CatalogModule, ProfileModule, UserModule, ProductPackingSizesModule],
  providers: [LotDataService],
  controllers: [LotDataController],
  exports: [LotDataModule, LotDataService]
})
export class LotDataModule {}
