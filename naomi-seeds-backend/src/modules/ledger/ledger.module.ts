import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogModule } from '../catalog/catalog.module';
import { lotDataSchema } from '../lot-data/lot-data.schema';
import { ProfileModule } from '../profile/profile.module';
// import { IptModule } from '../ipt/ipt.module';
import { ledgerSchema } from './ledger.schema';
import { UserModule } from '../users/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Ledger', schema: ledgerSchema }]), CatalogModule, ProfileModule, UserModule],
  providers: [LedgerService],
  controllers: [LedgerController],
  exports: [LedgerModule, LedgerService]
})

export class LedgerModule {}
