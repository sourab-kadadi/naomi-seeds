import { Module } from '@nestjs/common';
import { DropDownsController } from './drop-downs.controller';
import { dropDownsGeneral } from './drop-downs.schema';
import { DropDownsService } from './drop-downs.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'dropDownsGenerals', schema: dropDownsGeneral }])],
  controllers: [DropDownsController],
  providers: [DropDownsService],
  exports: [DropDownsModule, DropDownsService]
})
export class DropDownsModule {}



