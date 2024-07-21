import { Module } from '@nestjs/common';
import { RequirementService } from './requirement.service';
import { RequirementController } from './requirement.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { CatalogModule } from '../catalog/catalog.module';
// import { lotDataSchema } from '../lot-data/lot-data.schema';
import { ProfileModule } from '../profile/profile.module';
import { requirementSchema } from './requirement.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'RequirementData', schema: requirementSchema }]), ProfileModule],
  providers: [RequirementService],
  controllers: [RequirementController]
})
export class RequirementModule {}
