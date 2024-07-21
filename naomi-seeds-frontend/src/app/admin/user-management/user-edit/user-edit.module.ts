import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserEditPageRoutingModule } from './user-edit-routing.module';

import { UserEditPage } from './user-edit.page';
import { SharedModule } from '../../../shared/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserEditPageRoutingModule,
    SharedModule
  ],
  declarations: [UserEditPage]
})
export class UserEditPageModule {}
