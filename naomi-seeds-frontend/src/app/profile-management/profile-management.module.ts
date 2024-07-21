import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileManagementPageRoutingModule } from './profile-management-routing.module';

import { ProfileManagementPage } from './profile-management.page';
import { SharedModule } from '../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileManagementPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    IonicSelectableModule,
  ],
  declarations: [ProfileManagementPage]
})
export class ProfileManagementPageModule {}
