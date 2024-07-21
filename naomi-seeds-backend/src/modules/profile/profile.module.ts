import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesPermissionsModule } from '../roles-permissions/roles-permissions.module';
import { ProfileController } from './profile.controller';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Profile', schema: Profile }]), RolesPermissionsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
