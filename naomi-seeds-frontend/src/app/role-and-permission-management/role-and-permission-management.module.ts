import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoleAndPermissionManagementPageRoutingModule } from './role-and-permission-management-routing.module';

import { RoleAndPermissionManagementPage } from './role-and-permission-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoleAndPermissionManagementPageRoutingModule
  ],
  declarations: [RoleAndPermissionManagementPage]
})
export class RoleAndPermissionManagementPageModule {}
