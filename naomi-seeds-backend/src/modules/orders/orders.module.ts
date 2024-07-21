import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PdfServiceService } from '../pdf-service/pdf-service.service';
import { AwsService } from '../aws/aws.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ordersSchema } from './orders.schema';

import { ProfileModule } from '../profile/profile.module';
import { CatalogModule } from '../catalog/catalog.module';
import { LotDataModule } from '../lot-data/lot-data.module';
import { LedgerModule } from '../ledger/ledger.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'orders', schema: ordersSchema }]),  ProfileModule, CatalogModule, LotDataModule, LedgerModule, UserModule],
  controllers: [OrdersController],
  providers: [OrdersService, PdfServiceService, AwsService]
})
export class OrdersModule {}
