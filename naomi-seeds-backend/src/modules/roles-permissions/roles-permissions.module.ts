import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesPermissionsController } from './roles-permissions.controller';
import { RolesPermissionsService } from './roles-permissions.service';
import { rolesPermissionsSchema } from '../roles-permissions/roles-permissions.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'RolesPermissions', schema: rolesPermissionsSchema }])],
  controllers: [RolesPermissionsController],
  providers: [RolesPermissionsService],
  exports: [RolesPermissionsModule, RolesPermissionsService]
})
export class RolesPermissionsModule {}
