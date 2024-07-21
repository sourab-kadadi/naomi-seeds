import { Module } from '@nestjs/common';
// import { PdfServiceService } from '../pdf-service/pdf-service.service';
import { AwsService } from '../aws/aws.service';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfileModule } from '../profile/profile.module';
import { OrdersModule } from '../orders/orders.module';
import { CatalogModule } from '../catalog/catalog.module';
import { LotDataModule } from '../lot-data/lot-data.module';
import { LedgerModule } from '../ledger/ledger.module';
import { UserModule } from '../users/user.module';
import { paymentSchema } from './payment.schema';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'payments', schema: paymentSchema }]), ProfileModule, LotDataModule, LedgerModule, UserModule],
  controllers: [PaymentController],
  providers: [PaymentService, AwsService],
  exports: [PaymentModule]
})
export class PaymentModule { }
