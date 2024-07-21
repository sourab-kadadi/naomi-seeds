import { Module } from '@nestjs/common';
import { GeneralCrDrController } from './general-cr-dr.controller';
import { GeneralCrDrService } from './general-cr-dr.service';
import { MongooseModule } from '@nestjs/mongoose';
import { generalCrDrSchema } from './general-cr-dr.schema';

import { ProfileModule } from '../profile/profile.module';
import { CatalogModule } from '../catalog/catalog.module';
// import { LotDataModule } from '../lot-data/lot-data.module';
import { LotDataService } from '../lot-data/lot-data.service';
import { LotDataModule } from '../lot-data/lot-data.module';
import { LedgerModule } from '../ledger/ledger.module';
import { PdfServiceService } from '../pdf-service/pdf-service.service';
import { AwsService } from '../aws/aws.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'GeneralCrDr', schema: generalCrDrSchema }]),  ProfileModule, CatalogModule, LotDataModule, LedgerModule],
  controllers: [GeneralCrDrController],
  providers: [GeneralCrDrService, PdfServiceService, AwsService]
})

export class GeneralCrDrModule {}
