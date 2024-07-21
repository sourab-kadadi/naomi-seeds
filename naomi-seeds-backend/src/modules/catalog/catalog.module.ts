import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { catalog } from './catalog.schema';
import { UserModule } from '../users/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Catalog', schema: catalog }]), UserModule],
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [CatalogModule, CatalogService]
})
export class CatalogModule {}
